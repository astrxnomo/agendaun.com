"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { useAuthContext } from "@/contexts/auth-context"
import {
  getFacultiesBySede,
  getProgramsByFaculty,
  getSedes,
} from "@/lib/actions/academic.actions"
import { getUserProfile } from "@/lib/actions/profile.actions"

import type { Faculties, Programs, Sedes } from "@/types"

interface ConfigData {
  selectedSede: string
  selectedFacultad: string
  selectedPrograma: string
  sedeData?: Sedes
  facultadData?: Faculties
  programaData?: Programs
}

interface ConfigContextType {
  isComplete: boolean
  config: ConfigData
  displayText: string
  isLoading: boolean
  refreshConfig: () => Promise<void>
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const [config, setConfig] = useState<ConfigData>({
    selectedSede: "",
    selectedFacultad: "",
    selectedPrograma: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  const loadConfig = async () => {
    if (!user?.$id) {
      setConfig({
        selectedSede: "",
        selectedFacultad: "",
        selectedPrograma: "",
      })
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)

      // Load user profile and sedes in parallel
      const [userResult, sedesData] = await Promise.all([
        getUserProfile(user.$id),
        getSedes(),
      ])

      if (userResult.success && userResult.profile) {
        const profile = userResult.profile
        const newConfig: ConfigData = {
          selectedSede: profile.sede_id || "",
          selectedFacultad: profile.faculty_id || "",
          selectedPrograma: profile.program_id || "",
        }

        // Find sede data
        if (profile.sede_id) {
          newConfig.sedeData = sedesData.find((s) => s.$id === profile.sede_id)
        }

        // Load additional data if needed
        const promises = []
        if (profile.sede_id) {
          promises.push(getFacultiesBySede(profile.sede_id))
        }
        if (profile.faculty_id) {
          promises.push(getProgramsByFaculty(profile.faculty_id))
        }

        if (promises.length > 0) {
          const results = await Promise.all(promises)
          let index = 0

          if (profile.sede_id && profile.faculty_id) {
            const facultades = results[index++] as Faculties[]
            const programas = results[index] as Programs[]

            newConfig.facultadData = facultades.find(
              (f) => f.$id === profile.faculty_id,
            )
            newConfig.programaData = programas.find(
              (p) => p.$id === profile.program_id,
            )
          } else if (profile.sede_id) {
            const facultades = results[index] as Faculties[]
            newConfig.facultadData = facultades.find(
              (f) => f.$id === profile.faculty_id,
            )
          }
        }

        setConfig(newConfig)
      }
    } catch (error) {
      console.error("Error loading config:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.$id])

  const isComplete =
    config.selectedSede && config.selectedFacultad && config.selectedPrograma

  const displayText =
    isComplete && config.sedeData && config.facultadData && config.programaData
      ? `${config.sedeData.name} • ${config.facultadData.name} • ${config.programaData.name}`
      : "Sin configurar"

  return (
    <ConfigContext.Provider
      value={{
        isComplete: !!isComplete,
        config,
        displayText,
        isLoading,
        refreshConfig: loadConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return context
}
