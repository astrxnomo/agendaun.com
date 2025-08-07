"use client"

import { useCalendarContext } from "@/components/calendar/calendar-context"

/**
 * Hook especializado para filtros académicos en calendarios institucionales
 * Solo para calendarios de sede, facultad, programa y nacional
 */
export function useAcademicFilters() {
  const {
    filters,
    setFilters,
    handleFilterChange,
    clearFilters,
    activeFiltersCount,
    formatLabel,
    filterEventsByAcademicFilters,
  } = useCalendarContext()

  return {
    // Estado de filtros académicos
    filters,

    // Funciones de control
    setFilters,
    handleFilterChange,
    clearFilters,

    // Utilidades
    activeFiltersCount,
    formatLabel,
    filterEventsByAcademicFilters,
  }
}
