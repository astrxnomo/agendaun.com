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

  // Helper functions for external components
  updateSede: (sede: Sedes | null) => void
  updateFaculty: (faculty: Faculties | null) => void
  updateProgram: (program: Programs | null) => void

  // Auto-setup functionality
  isAcademicConfigComplete: boolean
  isAcademicConfigIncomplete: boolean
  showConfigDialog: boolean
  setShowConfigDialog: (show: boolean) => void
}

const AcademicContext = createContext<ConfigContextType | undefined>(undefined)

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const [selectedSede, setSelectedSede] = useState<Sedes | null>(null)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculties | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<Programs | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showConfigDialog, setShowConfigDialog] = useState(false)

  // Academic configuration status
  const isAcademicConfigComplete = Boolean(
    selectedSede && selectedFaculty && selectedProgram,
  )
  const isAcademicConfigIncomplete = Boolean(user && !isAcademicConfigComplete)

  // Helper function to clear all selections
  const clearSelections = useCallback(() => {
    setSelectedSede(null)
    setSelectedFaculty(null)
    setSelectedProgram(null)
  }, [])

  const loadConfig = useCallback(async () => {
    if (!user?.$id) {
      clearSelections()
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
        clearSelections()
        return
      }

      // TablesDB relationships are already loaded, just assign them directly
      if (profileResult) {
        // The relationships come fully populated from TablesDB
        setSelectedSede(profileResult.sede || null)
        setSelectedFaculty(profileResult.faculty || null)
        setSelectedProgram(profileResult.program || null)
      } else {
        clearSelections()
      }
    } catch (error) {
      console.error("Error loading config:", error)
      toast.error("Error cargando configuración académica")
      clearSelections()
    } finally {
      setIsLoading(false)
    }
  }, [user, clearSelections])

  useEffect(() => {
    void loadConfig()
  }, [loadConfig])

  // Auto-show config dialog when user is logged in but config is incomplete
  useEffect(() => {
    if (
      user &&
      !selectedSede &&
      !selectedFaculty &&
      !selectedProgram &&
      !isLoading
    ) {
      // Small delay to let everything load
      const timer = setTimeout(() => {
        setShowConfigDialog(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [user, selectedSede, selectedFaculty, selectedProgram, isLoading])

  // Helper functions for external updates
  const updateSede = useCallback((sede: Sedes | null) => {
    setSelectedSede(sede)
    // Clear dependent selections when sede changes
    if (sede?.faculties?.length === 0) {
      setSelectedFaculty(null)
      setSelectedProgram(null)
    }
  }, [])

  const updateFaculty = useCallback((faculty: Faculties | null) => {
    setSelectedFaculty(faculty)
    // Clear dependent selections when faculty changes
    if (faculty?.programs?.length === 0) {
      setSelectedProgram(null)
    }
  }, [])

  const updateProgram = useCallback((program: Programs | null) => {
    setSelectedProgram(program)
  }, [])

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
        updateSede,
        updateFaculty,
        updateProgram,

        // Auto-setup functionality
        isAcademicConfigComplete,
        isAcademicConfigIncomplete,
        showConfigDialog,
        setShowConfigDialog,
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
