/**
 * @fileoverview Smart Calendar Data Hook
 * @description Hook inteligente que se adapta automáticamente al tipo de calendario
 * @category Smart Hooks
 */

"use client"

import { useEffect, useMemo } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import { useCalendarData } from "@/components/calendar/hooks/use-calendar-data"
import { useDynamicCalendarPermissions } from "@/components/calendar/hooks/use-calendar-permissions"
import { useEventHandlers } from "@/components/calendar/hooks/use-event-handlers"

import type { Calendars, Etiquettes, Events } from "@/types"

// ===== TYPES =====

export interface SmartCalendarConfig {
  calendar: Calendars
  autoApplyFilters?: boolean
  enableRealTimeSync?: boolean
  preloadData?: boolean
}

export interface SmartCalendarReturn {
  // Datos procesados
  events: Events[]
  filteredEvents: Events[]
  visibleEvents: Events[]
  etiquettes: Etiquettes[]
  calendar: Calendars

  // Estados
  isLoading: boolean
  error: string | null
  isReady: boolean

  // Metadatos
  calendarType: "national" | "sede" | "facultad" | "programa" | "personal"
  hasAcademicFilters: boolean
  appliedFilters: {
    sede?: string
    facultad?: string
    programa?: string
  }

  // Acciones optimizadas
  actions: {
    // CRUD de eventos
    createEvent: (event: Partial<Events>) => Promise<Events>
    updateEvent: (id: string, updates: Partial<Events>) => Promise<Events>
    deleteEvent: (id: string) => Promise<void>
    duplicateEvent: (id: string) => Promise<Events>

    // Gestión masiva
    createBulkEvents: (events: Partial<Events>[]) => Promise<Events[]>
    deleteBulkEvents: (ids: string[]) => Promise<void>

    // Etiquetas
    toggleEtiquette: (color: string) => void
    showAllEtiquettes: () => void
    hideAllEtiquettes: () => void

    // Sincronización
    refresh: () => Promise<void>
    forceSync: () => Promise<void>
  }

  // Utilidades avanzadas
  utils: {
    getEventsByDateRange: (start: Date, end: Date) => Events[]
    getEventsByEtiquette: (color: string) => Events[]
    getEventsStats: () => {
      total: number
      byEtiquette: Record<string, number>
      upcoming: number
      past: number
    }
    exportEvents: (format: "json" | "csv" | "ical") => string
    searchEvents: (query: string) => Events[]
  }
}

// ===== MAIN HOOK =====

/**
 * Hook inteligente para manejo adaptativo de datos de calendario
 */
export function useSmartCalendar(
  config: SmartCalendarConfig,
): SmartCalendarReturn {
  const {
    calendar,
    autoApplyFilters = true,
    enableRealTimeSync = true,
  } = config

  // ===== CONTEXT & DATA =====

  const calendarContext = useCalendarContext()

  // Determinar tipo de calendario
  const calendarType = useMemo(() => {
    const slug = calendar.slug
    if (slug === "national-calendar") return "national"
    if (slug.startsWith("sede-")) return "sede"
    if (slug.startsWith("facultad-")) return "facultad"
    if (slug.startsWith("programa-")) return "programa"
    return "personal"
  }, [calendar.slug])

  // Datos del calendario
  const {
    data,
    isLoading: dataLoading,
    error: dataError,
    refetch: refetchData,
  } = useCalendarData(calendar)

  // Permisos dinámicos
  const { permissions, isLoading: permissionsLoading } =
    useDynamicCalendarPermissions(
      calendar.$id,
      calendarType,
      calendar.slug.split("-").slice(1).join("-"),
    )

  // Handlers de eventos
  const eventHandlers = useEventHandlers({
    calendar,
    permissions,
    onEventsUpdate: refetchData,
  })

  // ===== DERIVED STATE =====

  const rawEvents = data?.events || []
  const etiquettes = data?.etiquettes || []

  // Obtener filtros académicos aplicables
  const appliedFilters = useMemo(() => {
    if (!autoApplyFilters) return {}

    const filters = calendarContext.academicFilters
    const result: Record<string, string> = {}

    // Solo aplicar filtros relevantes según el tipo de calendario
    if (calendarType === "sede" && filters.sede) {
      result.sede = filters.sede
    }
    if (calendarType === "facultad" && filters.facultad) {
      result.facultad = filters.facultad
    }
    if (calendarType === "programa" && filters.programa) {
      result.programa = filters.programa
    }

    return result
  }, [calendarContext.academicFilters, autoApplyFilters, calendarType])

  // Filtrar eventos según filtros académicos
  const filteredEvents = useMemo(() => {
    if (Object.keys(appliedFilters).length === 0) {
      return rawEvents
    }

    return rawEvents.filter((event) => {
      // Filtrar por sede
      if (appliedFilters.sede && event.sedes?.slug !== appliedFilters.sede) {
        return false
      }

      // Filtrar por facultad
      if (
        appliedFilters.facultad &&
        event.faculties?.slug !== appliedFilters.facultad
      ) {
        return false
      }

      // Filtrar por programa
      if (
        appliedFilters.programa &&
        event.programs?.slug !== appliedFilters.programa
      ) {
        return false
      }

      return true
    })
  }, [rawEvents, appliedFilters])

  // Filtrar eventos por visibilidad de etiquetas
  const visibleEvents = useMemo(() => {
    const calendarId = calendar.slug as any
    return filteredEvents.filter((event) =>
      calendarContext.isEtiquetteVisible(calendarId, event.etiquette_id),
    )
  }, [filteredEvents, calendarContext, calendar.slug])

  // ===== ENHANCED ACTIONS =====

  const actions = useMemo(
    () => ({
      // CRUD básico
      createEvent: async (eventData: Partial<Events>): Promise<Events> => {
        const newEvent = {
          ...eventData,
          calendar_id: calendar.$id,
          // Aplicar filtros automáticamente si están activos
          ...(appliedFilters.sede && { sedes: { slug: appliedFilters.sede } }),
          ...(appliedFilters.facultad && {
            faculties: { slug: appliedFilters.facultad },
          }),
          ...(appliedFilters.programa && {
            programs: { slug: appliedFilters.programa },
          }),
        } as Events

        await eventHandlers.handleEventAdd(newEvent)
        return newEvent
      },

      updateEvent: async (
        id: string,
        updates: Partial<Events>,
      ): Promise<Events> => {
        const existingEvent = rawEvents.find((e) => e.$id === id)
        if (!existingEvent) throw new Error("Evento no encontrado")

        const updatedEvent = { ...existingEvent, ...updates }
        await eventHandlers.handleEventUpdate(updatedEvent)
        return updatedEvent
      },

      deleteEvent: eventHandlers.handleEventDelete,

      duplicateEvent: async (id: string): Promise<Events> => {
        const originalEvent = rawEvents.find((e) => e.$id === id)
        if (!originalEvent) throw new Error("Evento no encontrado")

        const duplicatedEvent = {
          ...originalEvent,
          title: `${originalEvent.title} (Copia)`,
          $id: undefined, // Será asignado por la DB
        } as Events

        return actions.createEvent(duplicatedEvent)
      },

      // Operaciones masivas
      createBulkEvents: async (
        eventsData: Partial<Events>[],
      ): Promise<Events[]> => {
        const results: Events[] = []
        for (const eventData of eventsData) {
          const newEvent = await actions.createEvent(eventData)
          results.push(newEvent)
        }
        return results
      },

      deleteBulkEvents: async (ids: string[]): Promise<void> => {
        for (const id of ids) {
          await eventHandlers.handleEventDelete(id)
        }
      },

      // Gestión de etiquetas
      toggleEtiquette: (color: string) => {
        calendarContext.toggleEtiquetteVisibility(calendar.slug as any, color)
      },

      showAllEtiquettes: () => {
        const allColors = etiquettes.map((etq) => etq.color)
        calendarContext.setCalendarEtiquettes(calendar.slug as any, etiquettes)
      },

      hideAllEtiquettes: () => {
        calendarContext.setCalendarEtiquettes(calendar.slug as any, [])
      },

      // Sincronización
      refresh: async () => {
        refetchData()
      },

      forceSync: async () => {
        // Forzar sincronización completa
        refetchData()
        if (enableRealTimeSync) {
          // Aquí se podría implementar lógica de sincronización en tiempo real
        }
      },
    }),
    [
      calendar,
      appliedFilters,
      eventHandlers,
      rawEvents,
      etiquettes,
      calendarContext,
      refetchData,
      enableRealTimeSync,
    ],
  )

  // ===== ADVANCED UTILITIES =====

  const utils = useMemo(
    () => ({
      getEventsByDateRange: (start: Date, end: Date): Events[] => {
        return visibleEvents.filter((event) => {
          const eventDate = new Date(event.start)
          return eventDate >= start && eventDate <= end
        })
      },

      getEventsByEtiquette: (color: string): Events[] => {
        return visibleEvents.filter(
          (event) =>
            etiquettes.find((etq) => etq.$id === event.etiquette_id)?.color ===
            color,
        )
      },

      getEventsStats: () => {
        const now = new Date()
        const upcoming = visibleEvents.filter(
          (event) => new Date(event.start) > now,
        ).length
        const past = visibleEvents.length - upcoming

        const byEtiquette: Record<string, number> = {}
        etiquettes.forEach((etq) => {
          byEtiquette[etq.color] = visibleEvents.filter(
            (event) => event.etiquette_id === etq.$id,
          ).length
        })

        return {
          total: visibleEvents.length,
          byEtiquette,
          upcoming,
          past,
        }
      },

      exportEvents: (format: "json" | "csv" | "ical"): string => {
        switch (format) {
          case "json":
            return JSON.stringify(visibleEvents, null, 2)
          case "csv":
            const headers = ["title", "start", "end", "description", "location"]
            const csvData = [
              headers.join(","),
              ...visibleEvents.map((event) =>
                headers
                  .map((header) => `"${event[header as keyof Events] || ""}"`)
                  .join(","),
              ),
            ]
            return csvData.join("\n")
          case "ical":
            // Implementación básica de iCal
            const icalEvents = visibleEvents
              .map((event) =>
                [
                  "BEGIN:VEVENT",
                  `DTSTART:${new Date(event.start).toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
                  event.end
                    ? `DTEND:${new Date(event.end).toISOString().replace(/[-:]/g, "").split(".")[0]}Z`
                    : "",
                  `SUMMARY:${event.title}`,
                  event.description ? `DESCRIPTION:${event.description}` : "",
                  event.location ? `LOCATION:${event.location}` : "",
                  "END:VEVENT",
                ]
                  .filter(Boolean)
                  .join("\n"),
              )
              .join("\n")

            return [
              "BEGIN:VCALENDAR",
              "VERSION:2.0",
              "PRODID:-//AgendaUN//Calendar//ES",
              icalEvents,
              "END:VCALENDAR",
            ].join("\n")
          default:
            return ""
        }
      },

      searchEvents: (query: string): Events[] => {
        const searchTerm = query.toLowerCase()
        return visibleEvents.filter(
          (event) =>
            event.title.toLowerCase().includes(searchTerm) ||
            event.description?.toLowerCase().includes(searchTerm) ||
            event.location?.toLowerCase().includes(searchTerm),
        )
      },
    }),
    [visibleEvents, etiquettes],
  )

  // ===== REAL-TIME SYNC =====

  useEffect(() => {
    if (!enableRealTimeSync) return

    // Implementar lógica de sincronización en tiempo real
    const interval = setInterval(() => {
      // Verificar si hay cambios y sincronizar si es necesario
      refetchData()
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [enableRealTimeSync, refetchData])

  // ===== RETURN STATE =====

  return {
    // Datos
    events: rawEvents,
    filteredEvents,
    visibleEvents,
    etiquettes,
    calendar,

    // Estados
    isLoading: dataLoading || permissionsLoading,
    error: dataError,
    isReady: !dataLoading && !permissionsLoading && !dataError,

    // Metadatos
    calendarType,
    hasAcademicFilters: Object.keys(appliedFilters).length > 0,
    appliedFilters,

    // Acciones
    actions,

    // Utilidades
    utils,
  }
}
