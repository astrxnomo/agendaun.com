import { useMemo } from "react"

import { type CalendarEvent } from "@/components/calendar/types"
import {
  filterEventsByUniversityContext,
  useUniversityFilters,
} from "@/contexts/university-filter-context"

interface UseFilteredEventsOptions {
  // Filtros adicionales específicos del componente
  additionalFilters?: {
    eventTypes?: string[]
    tags?: string[]
    instructors?: string[]
    locations?: string[]
    dateRange?: {
      start: Date
      end: Date
    }
  }

  // Control de rendimiento
  enableUniversityFiltering?: boolean
  enableAdditionalFiltering?: boolean
}

/**
 * Hook reutilizable para filtrar eventos basado en el contexto universitario
 * y filtros adicionales específicos del componente
 */
export function useFilteredEvents(
  events: CalendarEvent[],
  options: UseFilteredEventsOptions = {},
): {
  filteredEvents: CalendarEvent[]
  activeFiltersCount: number
  filterSummary: {
    total: number
    filtered: number
    campus?: string
    faculty?: string
    studyProgram?: string
  }
} {
  const {
    additionalFilters,
    enableUniversityFiltering = true,
    enableAdditionalFiltering = true,
  } = options

  const { filters, selectedCampus, selectedFaculty, selectedStudyProgram } =
    useUniversityFilters()

  const filteredEvents = useMemo(() => {
    let result = events

    // 1. Aplicar filtros universitarios
    if (enableUniversityFiltering) {
      result = filterEventsByUniversityContext(result, filters)
    }

    // 2. Aplicar filtros adicionales
    if (enableAdditionalFiltering && additionalFilters) {
      // Filtrar por tipos de evento
      if (
        additionalFilters.eventTypes &&
        additionalFilters.eventTypes.length > 0
      ) {
        result = result.filter((event) =>
          additionalFilters.eventTypes?.includes(
            event.metadata?.eventType as string,
          ),
        )
      }

      // Filtrar por tags
      if (additionalFilters.tags && additionalFilters.tags.length > 0) {
        result = result.filter((event) => {
          const eventTags = event.metadata?.tags! || []
          return additionalFilters.tags?.some((tag) => eventTags.includes(tag))
        })
      }

      // Filtrar por instructores
      if (
        additionalFilters.instructors &&
        additionalFilters.instructors.length > 0
      ) {
        result = result.filter((event) =>
          additionalFilters.instructors?.includes(event.metadata?.instructor!),
        )
      }

      // Filtrar por ubicaciones
      if (
        additionalFilters.locations &&
        additionalFilters.locations.length > 0
      ) {
        result = result.filter(
          (event) =>
            additionalFilters.locations?.includes(event.location || "") ||
            additionalFilters.locations?.includes(
              event.metadata?.location! || "",
            ),
        )
      }

      // Filtrar por rango de fechas
      if (additionalFilters.dateRange) {
        const { start, end } = additionalFilters.dateRange
        result = result.filter(
          (event) => event.start >= start && event.start <= end,
        )
      }
    }

    return result
  }, [
    events,
    filters,
    additionalFilters,
    enableUniversityFiltering,
    enableAdditionalFiltering,
  ])

  // Calcular número de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0

    if (filters.campusId) count++
    if (filters.facultyId) count++
    if (filters.studyProgramId) count++

    if (additionalFilters?.eventTypes?.length) count++
    if (additionalFilters?.tags?.length) count++
    if (additionalFilters?.instructors?.length) count++
    if (additionalFilters?.locations?.length) count++
    if (additionalFilters?.dateRange) count++

    return count
  }, [filters, additionalFilters])

  // Resumen de filtros
  const filterSummary = useMemo(
    () => ({
      total: events.length,
      filtered: filteredEvents.length,
      campus: selectedCampus?.name,
      faculty: selectedFaculty?.name,
      studyProgram: selectedStudyProgram?.name,
    }),
    [
      events.length,
      filteredEvents.length,
      selectedCampus,
      selectedFaculty,
      selectedStudyProgram,
    ],
  )

  return {
    filteredEvents,
    activeFiltersCount,
    filterSummary,
  }
}

/**
 * Hook específico para obtener datos únicos de eventos para crear filtros dinámicos
 */
export function useEventFilterOptions(events: CalendarEvent[]) {
  return useMemo(() => {
    const eventTypes = new Set<string>()
    const tags = new Set<string>()
    const instructors = new Set<string>()
    const locations = new Set<string>()
    const campuses = new Set<string>()
    const faculties = new Set<string>()

    events.forEach((event) => {
      if (event.metadata?.eventType) eventTypes.add(event.metadata.eventType)
      if (event.metadata?.instructor) instructors.add(event.metadata.instructor)
      if (event.location) locations.add(event.location)
      if (event.metadata?.location) locations.add(event.metadata.location)
      if (event.metadata?.campusId) campuses.add(event.metadata.campusId)
      if (event.metadata?.facultyId) faculties.add(event.metadata.facultyId)

      if (event.metadata?.tags) {
        event.metadata.tags.forEach((tag) => tags.add(tag))
      }
    })

    return {
      eventTypes: Array.from(eventTypes),
      tags: Array.from(tags),
      instructors: Array.from(instructors),
      locations: Array.from(locations),
      campuses: Array.from(campuses),
      faculties: Array.from(faculties),
    }
  }, [events])
}
