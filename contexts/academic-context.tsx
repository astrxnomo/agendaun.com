"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { useAuthContext } from "@/contexts/auth-context"
import {
  getFacultyById,
  getProgramById,
  getSedeById,
} from "@/lib/actions/academic.actions"
import { getUserProfile } from "@/lib/actions/profile.actions"
import { type Faculties, type Programs, type Sedes } from "@/types"

interface ConfigData {
  selectedSede: Sedes | null
  selectedFaculty: Faculties | null
  selectedProgram: Programs | null
}

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
  const [config, setConfig] = useState<ConfigData>({
    selectedSede: null,
    selectedFaculty: null,
    selectedProgram: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  const loadConfig = async () => {
    if (!user?.$id) {
      setConfig({
        selectedSede: null,
        selectedFaculty: null,
        selectedProgram: null,
      })
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)

      const profile = await getUserProfile(user.$id)

      if (profile) {
        const selectedSede = profile.sede_id
          ? await getSedeById(profile.sede_id)
          : null
        const selectedFaculty = profile.faculty_id
          ? await getFacultyById(profile.faculty_id)
          : null
        const selectedProgram = profile.program_id
          ? await getProgramById(profile.program_id)
          : null

        setConfig({
          selectedSede,
          selectedFaculty,
          selectedProgram,
        })
      } else {
        setConfig({
          selectedSede: null,
          selectedFaculty: null,
          selectedProgram: null,
        })
      }
    } catch (error) {
      console.error("Error loading config:", error)
      setConfig({
        selectedSede: null,
        selectedFaculty: null,
        selectedProgram: null,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.$id])

  const isComplete = !!config.selectedSede

  return (
    <AcademicContext.Provider
      value={{
        selectedSede: config.selectedSede,
        selectedFaculty: config.selectedFaculty,
        selectedProgram: config.selectedProgram,

        isComplete: !!isComplete,
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
