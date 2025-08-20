/**
 * @fileoverview Academic Filter Hook - Database Integration
 * @description Hook para manejar filtros académicos con datos de la base de datos
 * @category Academic Hooks
 */

"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getFacultiesBySede,
  getProgramsByFaculty,
  getSedes,
} from "@/lib/actions/academic.actions"

import type { Faculties, Programs, Sedes } from "@/types"

// ===== TYPES =====

export interface AcademicFilters {
  sede: string
  facultad: string
  programa: string
}

interface AcademicData {
  sedes: Sedes[]
  facultades: Faculties[]
  programas: Programs[]
}

interface UseAcademicFiltersReturn {
  // Data
  academicData: AcademicData

  // Current filters
  filters: AcademicFilters

  // Loading states
  isLoading: boolean
  isLoadingFacultades: boolean
  isLoadingProgramas: boolean

  // Error states
  error: string | null

  // Actions
  setFilter: (filterType: keyof AcademicFilters, value: string) => void
  clearFilters: () => void

  // Computed data
  availableFacultades: Faculties[]
  availableProgramas: Programs[]

  // Validation
  isComplete: boolean
  activeFiltersCount: number
}

// ===== HOOK =====

export function useAcademicFilters(
  initialFilters: AcademicFilters = { sede: "", facultad: "", programa: "" },
): UseAcademicFiltersReturn {
  // ===== STATE =====
  const [filters, setFilters] = useState<AcademicFilters>(initialFilters)
  const [academicData, setAcademicData] = useState<AcademicData>({
    sedes: [],
    facultades: [],
    programas: [],
  })

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFacultades, setIsLoadingFacultades] = useState(false)
  const [isLoadingProgramas, setIsLoadingProgramas] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ===== COMPUTED VALUES =====
  const availableFacultades = academicData.facultades
  const availableProgramas = academicData.programas
  const activeFiltersCount = Object.values(filters).filter(Boolean).length
  const isComplete = activeFiltersCount >= 3

  // ===== LOAD DATA FUNCTIONS =====

  // Load sedes (only once)
  useEffect(() => {
    async function loadSedes() {
      try {
        setIsLoading(true)
        setError(null)
        const sedes = await getSedes()
        setAcademicData((prev) => ({ ...prev, sedes }))
      } catch (err) {
        setError("Error al cargar las sedes")
        console.error("Error loading sedes:", err)
      } finally {
        setIsLoading(false)
      }
    }

    void loadSedes()
  }, [])

  // Load facultades when sede changes
  useEffect(() => {
    async function loadFacultades() {
      if (!filters.sede || academicData.sedes.length === 0) {
        setAcademicData((prev) => ({ ...prev, facultades: [], programas: [] }))
        return
      }

      try {
        setIsLoadingFacultades(true)
        setError(null)

        const sede = academicData.sedes.find((s) => s.$id === filters.sede)
        if (!sede) {
          throw new Error(`Sede no encontrada: ${filters.sede}`)
        }

        const facultades = await getFacultiesBySede(sede.$id)
        setAcademicData((prev) => ({ ...prev, facultades, programas: [] }))
      } catch (err) {
        console.error("Error loading facultades:", err)
        setError("Error al cargar las facultades")
      } finally {
        setIsLoadingFacultades(false)
      }
    }

    void loadFacultades()
  }, [filters.sede, academicData.sedes])

  // Load programas when facultad changes
  useEffect(() => {
    async function loadProgramas() {
      console.log("🔍 Loading programas - estado:", {
        facultadFiltro: filters.facultad,
        facultadesDisponibles: academicData.facultades.map((f) => ({
          id: f.$id,
          name: f.name,
        })),
        facultadesCount: academicData.facultades.length,
      })

      if (!filters.facultad || academicData.facultades.length === 0) {
        setAcademicData((prev) => ({ ...prev, programas: [] }))
        return
      }

      try {
        setIsLoadingProgramas(true)
        setError(null)

        const facultad = academicData.facultades.find(
          (f) => f.$id === filters.facultad,
        )

        console.log("🏛️ Facultad encontrada:", facultad)

        if (!facultad) {
          throw new Error(`Facultad no encontrada: ${filters.facultad}`)
        }

        console.log(
          "📡 Cargando programas para facultad:",
          facultad.name,
          "ID:",
          facultad.$id,
        )
        const programas = await getProgramsByFaculty(facultad.$id)
        console.log("✅ Programas cargados:", programas.length, programas)

        setAcademicData((prev) => ({ ...prev, programas }))
      } catch (err) {
        console.error("Error loading programas:", err)
        setError("Error al cargar los programas")
      } finally {
        setIsLoadingProgramas(false)
      }
    }

    void loadProgramas()
  }, [filters.facultad, academicData.facultades])

  // ===== ACTIONS =====

  const setFilter = useCallback(
    (filterType: keyof AcademicFilters, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [filterType]: value }

        // Reset dependent filters
        if (filterType === "sede") {
          newFilters.facultad = ""
          newFilters.programa = ""
        } else if (filterType === "facultad") {
          newFilters.programa = ""
        }

        return newFilters
      })
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters({ sede: "", facultad: "", programa: "" })
  }, [])

  // ===== RETURN =====
  return {
    academicData,
    filters,
    isLoading,
    isLoadingFacultades,
    isLoadingProgramas,
    error,
    setFilter,
    clearFilters,
    availableFacultades,
    availableProgramas,
    isComplete,
    activeFiltersCount,
  }
}
