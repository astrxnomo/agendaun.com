/**
 * @fileoverview Academic Filter Hook - Simplified Version
 * @description Hook simplificado para manejar filtros académicos con consultas directas
 */

"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import {
  getFacultiesBySede,
  getProgramsByFaculty,
  getSedes,
} from "@/lib/actions/academic.actions"

import type { Faculties, Programs, Sedes } from "@/types"

export interface AcademicFilters {
  sede: string
  facultad: string
  programa: string
}

interface UseAcademicFiltersReturn {
  // Data lists for dropdowns
  sedes: Sedes[]
  availableFacultades: Faculties[]
  availableProgramas: Programs[]

  // Current filters
  filters: AcademicFilters

  // Loading and error states
  isLoading: boolean
  error: string | null

  // Actions
  setFilter: (filterType: keyof AcademicFilters, value: string) => void
  setAllFilters: (filters: AcademicFilters) => void
  clearFilters: () => void

  // Validation
  isComplete: boolean

  // Simple display text getter
  getDisplayText: () => string
}

export function useAcademicFilters(
  initialFilters: AcademicFilters = { sede: "", facultad: "", programa: "" },
): UseAcademicFiltersReturn {
  const [filters, setFilters] = useState<AcademicFilters>(initialFilters)
  const [sedes, setSedes] = useState<Sedes[]>([])
  const [facultades, setFacultades] = useState<Faculties[]>([])
  const [programas, setProgramas] = useState<Programs[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load sedes once
  useEffect(() => {
    async function loadSedes() {
      try {
        setIsLoading(true)
        setError(null)
        const sedesData = await getSedes()
        setSedes(sedesData)
      } catch (err) {
        setError("Error cargando sedes")
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
        setFacultades([])
        setProgramas([])
        return
      }

      try {
        const facultadesData = await getFacultiesBySede(filters.sede)
        setFacultades(facultadesData)
        setProgramas([]) // Reset programas when sede changes
      } catch (err) {
        setError("Error cargando facultades")
        console.error("Error loading facultades:", err)
      }
    }
    void loadFacultades()
  }, [filters.sede])

  // Load programas when facultad changes
  useEffect(() => {
    async function loadProgramas() {
      if (!filters.facultad) {
        setProgramas([])
        return
      }

      try {
        const programasData = await getProgramsByFaculty(filters.facultad)
        setProgramas(programasData)
      } catch (err) {
        setError("Error cargando programas")
        console.error("Error loading programas:", err)
      }
    }
    void loadProgramas()
  }, [filters.facultad])

  // Validation
  const isComplete = useMemo(() => {
    return !!(filters.sede && filters.facultad && filters.programa)
  }, [filters])

  // Simple display text getter - busca directamente en los arrays cargados
  const getDisplayText = useCallback(() => {
    if (!filters.sede) return "Sin configurar"

    const parts = []

    // Buscar sede
    const sede = sedes.find((s) => s.$id === filters.sede)
    if (sede) parts.push(sede.name)

    // Buscar facultad
    if (filters.facultad) {
      const facultad = facultades.find((f) => f.$id === filters.facultad)
      if (facultad) parts.push(facultad.name)
    }

    // Buscar programa
    if (filters.programa) {
      const programa = programas.find((p) => p.$id === filters.programa)
      if (programa) parts.push(programa.name)
    }

    return parts.join(" • ")
  }, [filters, sedes, facultades, programas])

  // Actions
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

  const setAllFilters = useCallback((newFilters: AcademicFilters) => {
    setFilters(newFilters)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ sede: "", facultad: "", programa: "" })
  }, [])

  return {
    sedes,
    availableFacultades: facultades,
    availableProgramas: programas,
    filters,
    isLoading,
    error,
    setFilter,
    setAllFilters,
    clearFilters,
    isComplete,
    getDisplayText,
  }
}
