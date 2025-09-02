"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { toast } from "sonner"

import { useAuthContext } from "@/contexts/auth-context"
import { getUserProfile } from "@/lib/actions/profiles.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"
import { type Faculties, type Programs, type Sedes } from "@/types"

interface ConfigContextType {
  selectedSede: Sedes | null
  selectedFaculty: Faculties | null
  selectedProgram: Programs | null

  isComplete: boolean
  isLoading: boolean

  refreshConfig: () => Promise<void>
}

const AcademicContext = createContext<ConfigContextType | undefined>(undefined)

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const [selectedSede, setSelectedSede] = useState<Sedes | null>(null)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculties | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<Programs | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadConfig = useCallback(async () => {
    if (!user?.$id) {
      setSelectedSede(null)
      setSelectedFaculty(null)
      setSelectedProgram(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)

      const profileResult = await getUserProfile()

      if (isAppwriteError(profileResult)) {
        toast.error("Error cargando perfil de usuario", {
          description: profileResult.type,
        })
        setSelectedSede(null)
        setSelectedFaculty(null)
        setSelectedProgram(null)
        return
      }

      if (profileResult) {
        setSelectedSede(profileResult.sede || null)
        setSelectedFaculty(profileResult.faculty || null)
        setSelectedProgram(profileResult.program || null)
      } else {
        setSelectedSede(null)
        setSelectedFaculty(null)
        setSelectedProgram(null)
      }
    } catch (error) {
      console.error("Error loading config:", error)
      toast.error("Error cargando configuración académica")
      setSelectedSede(null)
      setSelectedFaculty(null)
      setSelectedProgram(null)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    void loadConfig()
  }, [loadConfig])

  const isComplete = !!selectedSede

  return (
    <AcademicContext.Provider
      value={{
        selectedSede,
        selectedFaculty,
        selectedProgram,

        isComplete,
        isLoading,

        refreshConfig: loadConfig,
      }}
    >
      {children}
    </AcademicContext.Provider>
  )
}

export function useAcademicConfig() {
  const context = useContext(AcademicContext)
  if (!context) {
    throw new Error("useAcademicConfig must be used within an AcademicProvider")
  }
  return context
}
