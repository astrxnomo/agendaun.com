/**
 * @fileoverview Unified Calendar State Hook
 * @description Hook centralizado para el manejo del estado de calendarios con sincronización automática
 * @category State Management Hooks
 */

"use client"

import { useEffect, useMemo } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import {
  getCalendarType,
  useCalendarDataContext,
  type CalendarType,
} from "@/components/calendar/calendar-data-context"
import { getEventColor } from "@/components/calendar/utils"

import type { Calendars, Etiquettes, Events } from "@/types"
import type { CalendarPermissions } from "./use-calendar-permissions"

// ===== TYPES =====

export interface CalendarStateConfig {
  /** ID único del calendario */
  calendarId: string
  /** Slug del calendario para determinar tipo */
  calendarSlug: string
  /** Si debe aplicar filtros académicos automáticamente */
  applyAcademicFilters?: boolean
  /** Si debe sincronizar con el contexto global */
  syncWithGlobal?: boolean
}

export interface CalendarStateReturn {
  // Datos principales
  calendar: Calendars
  rawEvents: Events[]
  filteredEvents: Events[]
  visibleEvents: Events[]
  etiquettes: Etiquettes[]
  calendarType: CalendarType
  permissions: CalendarPermissions

  // Estados de UI
  isLoading: boolean
  error: string | null
  isReady: boolean

  // Filtros y configuración
  academicFilters: {
    sede: string
    facultad: string
    programa: string
  }
  hasActiveFilters: boolean

  // Acciones unificadas
  actions: {
    // Gestión de eventos
    addEvent: (event: Events) => Promise<void>
    updateEvent: (event: Events) => Promise<void>
    deleteEvent: (eventId: string) => Promise<void>

    // Gestión de etiquetas
    toggleEtiquetteVisibility: (color: string) => void
    setEtiquettesVisibility: (colors: string[]) => void

    // Gestión de datos
    refetch: () => void
    refresh: () => Promise<void>
  }

  // Utilidades
  utils: {
    getEventColor: (event: Events) => string
    isEventVisible: (event: Events) => boolean
    getEventsByDate: (date: Date) => Events[]
    getUpcomingEvents: (limit?: number) => Events[]
  }
}

// ===== MAIN HOOK =====

/**
 * Hook principal para el manejo unificado del estado de calendarios
 * @param config - Configuración del calendario
 * @returns Estado y acciones del calendario
 */
export function useCalendarState(
  config: CalendarStateConfig,
): CalendarStateReturn {
  // ===== CONTEXT DATA =====

  const calendarContext = useCalendarContext()
  const dataContext = useCalendarDataContext()

  // ===== DERIVED STATE =====

  const calendarType = useMemo(
    () => getCalendarType(config.calendarSlug),
    [config.calendarSlug],
  )

  const academicFilters = useMemo(
    () => calendarContext.academicFilters,
    [calendarContext.academicFilters],
  )

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        academicFilters.sede ||
          academicFilters.facultad ||
          academicFilters.programa,
      ),
    [academicFilters],
  )

  // ===== EVENT FILTERING =====

  // Filtrar eventos por filtros académicos si aplica
  const filteredEvents = useMemo(() => {
    if (!config.applyAcademicFilters || !hasActiveFilters) {
      return dataContext.events
    }

    return dataContext.events.filter((event) => {
      // Filtrar por sede
      if (academicFilters.sede && calendarType === "sede") {
        return event.sedes?.slug === academicFilters.sede
      }

      // Filtrar por facultad
      if (academicFilters.facultad && calendarType === "facultad") {
        return event.faculties?.slug === academicFilters.facultad
      }

      // Filtrar por programa
      if (academicFilters.programa && calendarType === "programa") {
        return event.programs?.slug === academicFilters.programa
      }

      return true
    })
  }, [
    dataContext.events,
    config.applyAcademicFilters,
    hasActiveFilters,
    academicFilters,
    calendarType,
  ])

  // Filtrar eventos por visibilidad de etiquetas
  const visibleEvents = useMemo(() => {
    return filteredEvents.filter((event) =>
      calendarContext.isEtiquetteVisible(
        config.calendarSlug as any,
        event.etiquette_id,
      ),
    )
  }, [filteredEvents, calendarContext, config.calendarSlug])

  // ===== UNIFIED ACTIONS =====

  const actions = useMemo(
    () => ({
      // Gestión de eventos
      addEvent: dataContext.addEvent,
      updateEvent: dataContext.updateEvent,
      deleteEvent: dataContext.deleteEvent,

      // Gestión de etiquetas
      toggleEtiquetteVisibility: (color: string) => {
        calendarContext.toggleEtiquetteVisibility(
          config.calendarSlug as any,
          color,
        )
      },

      setEtiquettesVisibility: (colors: string[]) => {
        calendarContext.setCalendarEtiquettes(
          config.calendarSlug as any,
          dataContext.etiquettes.filter((etq) => colors.includes(etq.color)),
        )
      },

      // Gestión de datos
      refetch: dataContext.refetch,

      refresh: async () => {
        dataContext.refetch()
      },
    }),
    [dataContext, calendarContext, config.calendarSlug],
  )

  // ===== UTILITIES =====

  const utils = useMemo(
    () => ({
      getEventColor: (event: Events) =>
        getEventColor(event, dataContext.etiquettes),

      isEventVisible: (event: Events) => {
        return calendarContext.isEtiquetteVisible(
          config.calendarSlug as any,
          event.etiquette_id,
        )
      },

      getEventsByDate: (date: Date) => {
        const dateStr = date.toISOString().split("T")[0]
        return visibleEvents.filter((event) => event.start.startsWith(dateStr))
      },

      getUpcomingEvents: (limit = 10) => {
        const now = new Date()
        return visibleEvents
          .filter((event) => new Date(event.start) > now)
          .sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
          )
          .slice(0, limit)
      },
    }),
    [
      dataContext.etiquettes,
      calendarContext,
      config.calendarSlug,
      visibleEvents,
    ],
  )

  // ===== SYNC EFFECTS =====

  // Sincronizar etiquetas al cargar
  useEffect(() => {
    if (dataContext.etiquettes.length > 0 && config.syncWithGlobal) {
      calendarContext.setCalendarEtiquettes(
        config.calendarSlug as any,
        dataContext.etiquettes,
      )
    }
  }, [
    dataContext.etiquettes,
    calendarContext,
    config.calendarSlug,
    config.syncWithGlobal,
  ])

  // ===== RETURN STATE =====

  return {
    // Datos principales
    calendar: dataContext.calendar,
    rawEvents: dataContext.events,
    filteredEvents,
    visibleEvents,
    etiquettes: dataContext.etiquettes,
    calendarType,
    permissions: dataContext.permissions,

    // Estados de UI
    isLoading: dataContext.isLoading,
    error: dataContext.error,
    isReady: !dataContext.isLoading && !dataContext.error,

    // Filtros
    academicFilters,
    hasActiveFilters,

    // Acciones
    actions,

    // Utilidades
    utils,
  }
}
