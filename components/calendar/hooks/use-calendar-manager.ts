// Hook para usar el contexto del calendario con un ID específico
import { useCalendarContext, type CalendarId } from "../calendar-context"

import type { Etiquette } from "../types"

export function useCalendarManager(calendarId: CalendarId) {
  const context = useCalendarContext()

  return {
    // Date management (shared)
    currentDate: context.currentDate,
    setCurrentDate: context.setCurrentDate,

    // Etiquette management (calendar-specific)
    isEtiquetteVisible: (color: string | undefined) =>
      context.isEtiquetteVisible(calendarId, color),
    toggleEtiquetteVisibility: (color: string) =>
      context.toggleEtiquetteVisibility(calendarId, color),
    setCalendarEtiquettes: (etiquettes: Etiquette[]) =>
      context.setCalendarEtiquettes(calendarId, etiquettes),

    // Academic filters (shared)
    academicFilters: context.academicFilters,
    setAcademicFilter: context.setAcademicFilter,
    clearAcademicFilters: context.clearAcademicFilters,
  }
}
