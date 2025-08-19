// Hook para usar el contexto del calendario con un ID específico
import { useCallback, useMemo } from "react"

import { useCalendarContext, type CalendarId } from "../calendar-context"

import type { Etiquettes } from "@/types"

export function useCalendarManager(calendarId: CalendarId) {
  const context = useCalendarContext()

  // Memoize calendar-specific functions
  const isEtiquetteVisible = useCallback(
    (color: string | undefined) =>
      context.isEtiquetteVisible(calendarId, color),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context.isEtiquetteVisible, calendarId],
  )

  const toggleEtiquetteVisibility = useCallback(
    (color: string) => context.toggleEtiquetteVisibility(calendarId, color),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context.toggleEtiquetteVisibility, calendarId],
  )

  const setCalendarEtiquettes = useCallback(
    (etiquettes: Etiquettes[]) =>
      context.setCalendarEtiquettes(calendarId, etiquettes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context.setCalendarEtiquettes, calendarId],
  )

  // Memoize the return object
  return useMemo(
    () => ({
      // Date management (shared)
      currentDate: context.currentDate,
      setCurrentDate: context.setCurrentDate,

      // Etiquette management (calendar-specific)
      isEtiquetteVisible,
      toggleEtiquetteVisibility,
      setCalendarEtiquettes,

      // Academic filters (shared)
      academicFilters: context.academicFilters,
      setAcademicFilter: context.setAcademicFilter,
      clearAcademicFilters: context.clearAcademicFilters,
    }),
    [
      context.currentDate,
      context.setCurrentDate,
      context.academicFilters,
      context.setAcademicFilter,
      context.clearAcademicFilters,
      isEtiquetteVisible,
      toggleEtiquetteVisibility,
      setCalendarEtiquettes,
    ],
  )
}
