// Hook para usar el contexto del calendario con un ID específico
import { type Etiquettes } from "@/types/db"

import { useCalendarContext } from "../calendar-context"

export function useCalendarManager(calendarId: string) {
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
    setCalendarEtiquettes: (etiquettes: Etiquettes[]) =>
      context.setCalendarEtiquettes(calendarId, etiquettes),

    // Academic filters (shared)
    academicFilters: context.academicFilters,
    setAcademicFilter: context.setAcademicFilter,
    clearAcademicFilters: context.clearAcademicFilters,
  }
}
