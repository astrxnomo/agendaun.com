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

/**
 * Hook para manejar filtros académicos con datos de la base de datos
 * Carga las sedes inicialmente y las facultades/programas dinámicamente
 * @param initialFilters - Filtros iniciales
 * @returns Interfaz completa para manejo de filtros académicos
 */
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

  // Error state
  const [error, setError] = useState<string | null>(null)

  // ===== COMPUTED VALUES =====

  const availableFacultades = academicData.facultades
  const availableProgramas = academicData.programas
  const activeFiltersCount = Object.values(filters).filter(Boolean).length
  const isComplete = activeFiltersCount >= 3

  // ===== EFFECTS =====

  // Load initial sedes
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
      if (!filters.sede) {
        setAcademicData((prev) => ({ ...prev, facultades: [], programas: [] }))
        return
      }

      try {
        setIsLoadingFacultades(true)
        setError(null)

        // Find sede by slug
        const sede = academicData.sedes.find((s) => s.slug === filters.sede)
        if (!sede) {
          throw new Error("Sede no encontrada")
        }

        const facultades = await getFacultiesBySede(sede.$id)
        setAcademicData((prev) => ({ ...prev, facultades, programas: [] }))
      } catch (err) {
        setError("Error al cargar las facultades")
        console.error("Error loading facultades:", err)
      } finally {
        setIsLoadingFacultades(false)
      }
    }

    void loadFacultades()
  }, [filters.sede, academicData.sedes])

  // Load programas when facultad changes
  useEffect(() => {
    async function loadProgramas() {
      if (!filters.facultad) {
        setAcademicData((prev) => ({ ...prev, programas: [] }))
        return
      }

      try {
        setIsLoadingProgramas(true)
        setError(null)

        // Find facultad by slug
        const facultad = academicData.facultades.find(
          (f) => f.slug === filters.facultad,
        )
        if (!facultad) {
          throw new Error("Facultad no encontrada")
        }

        const programas = await getProgramsByFaculty(facultad.$id)
        setAcademicData((prev) => ({ ...prev, programas }))
      } catch (err) {
        setError("Error al cargar los programas")
        console.error("Error loading programas:", err)
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
        const newFilters = { ...prev }

        // Update the specific filter
        newFilters[filterType] = value

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
    // Data
    academicData,

    // Current filters
    filters,

    // Loading states
    isLoading,
    isLoadingFacultades,
    isLoadingProgramas,

    // Error state
    error,

    // Actions
    setFilter,
    clearFilters,

    // Computed data
    availableFacultades,
    availableProgramas,

    // Validation
    isComplete,
    activeFiltersCount,
  }
}
