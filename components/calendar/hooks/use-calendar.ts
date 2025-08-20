/**
 * @fileoverview Main Calendar Hook - Unified Calendar Management
 * @description Hook principal que unifica toda la lógica de calendario con filtros académicos y gestión de etiquetas
 * @category Main Hooks
 */

"use client"

import { useMemo } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import {
  useCalendarDataContext,
  type CalendarType,
} from "@/components/calendar/calendar-data-context"
import { getEventColor } from "@/components/calendar/utils"

import type { Calendars, Etiquettes, Events } from "@/types"
import type { CalendarPermissions } from "./use-calendar-permissions"

// ===== TYPES =====

export interface UseCalendarReturn {
  // Datos procesados
  events: Events[]
  visibleEvents: Events[]
  etiquettes: Etiquettes[]
  permissions: CalendarPermissions
  calendar: Calendars
  calendarType: CalendarType

  // Estados de UI
  isLoading: boolean
  error: string | null

  // Filtros académicos (solo para calendarios que los necesiten)
  academicFilters: {
    sede: string
    facultad: string
    programa: string
  } | null
  hasAcademicFilters: boolean

  // Acciones unificadas
  actions: {
    // Eventos
    addEvent: (event: Events) => Promise<void>
    updateEvent: (event: Events) => Promise<void>
    deleteEvent: (eventId: string) => Promise<void>
    refetch: () => void

    // Filtros académicos (solo si aplica)
    setAcademicFilter?: (
      filterType: "sede" | "facultad" | "programa",
      value: string,
    ) => void
    clearAcademicFilters?: () => void

    // Etiquetas
    toggleEtiquetteVisibility: (color: string) => void
    isEtiquetteVisible: (color: string | undefined) => boolean
    setCalendarEtiquettes: (etiquettes: Etiquettes[]) => void
  }
}

// ===== MAIN HOOK =====

/**
 * Hook unificado para manejar cualquier tipo de calendario
 * Combina datos, permisos, filtros académicos y gestión de etiquetas
 * @returns Interfaz completa para manejar calendarios con todas sus funcionalidades
 */
export function useCalendar(): UseCalendarReturn {
  // Contextos
  const calendarData = useCalendarDataContext()
  const calendarUI = useCalendarContext()

  // ===== COMPUTED PROPERTIES =====

  // Determinar si necesita filtros académicos
  const hasAcademicFilters = !["national", "personal"].includes(
    calendarData.calendarType,
  )

  // ===== EVENT FILTERING =====

  // Filtrar eventos según filtros académicos (solo si aplica)
  const filteredEvents = useMemo(() => {
    if (!hasAcademicFilters) return calendarData.events

    const { sede, facultad, programa } = calendarUI.academicFilters

    // Si no hay filtros activos, mostrar todos
    if (!sede && !facultad && !programa) return calendarData.events

    return calendarData.events.filter((event) => {
      // Aplicar filtros según el tipo de calendario y filtros activos
      const matchesSede = !sede || event.sede_id === sede
      const matchesFacultad = !facultad || event.faculties_id === facultad
      const matchesPrograma = !programa || event.programs_id === programa

      return matchesSede && matchesFacultad && matchesPrograma
    })
  }, [calendarData.events, calendarUI.academicFilters, hasAcademicFilters])

  // Filtrar eventos visibles según etiquetas
  const visibleEvents = useMemo(() => {
    return filteredEvents.filter((event) => {
      const color = getEventColor(event, calendarData.etiquettes)
      return calendarUI.isEtiquetteVisible(calendarData.calendarType, color)
    })
  }, [
    filteredEvents,
    calendarData.etiquettes,
    calendarData.calendarType,
    calendarUI,
  ])

  // ===== ACTION MEMOIZATION =====

  // Acciones específicas para etiquetas de este calendario
  const etiquetteActions = useMemo(
    () => ({
      toggleEtiquetteVisibility: (color: string) => {
        calendarUI.toggleEtiquetteVisibility(calendarData.calendarType, color)
      },
      isEtiquetteVisible: (color: string | undefined) => {
        return calendarUI.isEtiquetteVisible(calendarData.calendarType, color)
      },
      setCalendarEtiquettes: (etiquettes: Etiquettes[]) => {
        calendarUI.setCalendarEtiquettes(calendarData.calendarType, etiquettes)
      },
    }),
    [calendarData.calendarType, calendarUI],
  )

  // Acciones para filtros académicos (solo si aplica)
  const academicFilterActions = useMemo(() => {
    if (!hasAcademicFilters) return {}

    return {
      setAcademicFilter: calendarUI.setAcademicFilter,
      clearAcademicFilters: calendarUI.clearAcademicFilters,
    }
  }, [
    hasAcademicFilters,
    calendarUI.setAcademicFilter,
    calendarUI.clearAcademicFilters,
  ])

  return useMemo(
    () => ({
      // Datos procesados
      events: filteredEvents,
      visibleEvents,
      etiquettes: calendarData.etiquettes,
      permissions: calendarData.permissions,
      calendar: calendarData.calendar,
      calendarType: calendarData.calendarType,

      // Estados
      isLoading: calendarData.isLoading,
      error: calendarData.error,

      // Filtros académicos
      academicFilters: hasAcademicFilters ? calendarUI.academicFilters : null,
      hasAcademicFilters,

      // Acciones unificadas
      actions: {
        // Eventos
        addEvent: calendarData.addEvent,
        updateEvent: calendarData.updateEvent,
        deleteEvent: calendarData.deleteEvent,
        refetch: calendarData.refetch,

        // Filtros académicos (condicionalmente)
        ...academicFilterActions,

        // Etiquetas
        ...etiquetteActions,
      },
    }),
    [
      filteredEvents,
      visibleEvents,
      calendarData.etiquettes,
      calendarData.permissions,
      calendarData.calendar,
      calendarData.calendarType,
      calendarData.isLoading,
      calendarData.error,
      calendarData.addEvent,
      calendarData.updateEvent,
      calendarData.deleteEvent,
      calendarData.refetch,
      hasAcademicFilters,
      calendarUI.academicFilters,
      academicFilterActions,
      etiquetteActions,
    ],
  )
}
