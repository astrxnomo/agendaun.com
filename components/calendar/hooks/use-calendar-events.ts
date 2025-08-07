"use client"

import { useCallback, useState } from "react"

import { type CalendarEvent } from "@/components/calendar/types"

interface UseCalendarEventsReturn {
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
  addEvent: (event: CalendarEvent) => void
  updateEvent: (eventId: string, updatedEvent: Partial<CalendarEvent>) => void
  deleteEvent: (eventId: string) => void
  getEventById: (eventId: string) => CalendarEvent | undefined
  getEventsForDate: (date: Date) => CalendarEvent[]
  getEventsForDateRange: (startDate: Date, endDate: Date) => CalendarEvent[]
}

/**
 * Hook especializado para lógica de eventos en calendarios
 * Proporciona CRUD completo y consultas de eventos
 */
export function useCalendarEvents(
  initialEvents: CalendarEvent[] = [],
): UseCalendarEventsReturn {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)

  // Agregar evento
  const addEvent = useCallback((event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event])
  }, [])

  // Actualizar evento
  const updateEvent = useCallback(
    (eventId: string, updatedEvent: Partial<CalendarEvent>) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, ...updatedEvent } : event,
        ),
      )
    },
    [],
  )

  // Eliminar evento
  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId),
    )
  }, [])

  // Obtener evento por ID
  const getEventById = useCallback(
    (eventId: string) => {
      return events.find((event) => event.id === eventId)
    },
    [events],
  )

  // Obtener eventos para una fecha específica
  const getEventsForDate = useCallback(
    (date: Date) => {
      const targetDate = new Date(date)
      targetDate.setHours(0, 0, 0, 0)

      return events.filter((event) => {
        const eventStartDate = new Date(event.start)
        eventStartDate.setHours(0, 0, 0, 0)

        const eventEndDate = new Date(event.end)
        eventEndDate.setHours(0, 0, 0, 0)

        return targetDate >= eventStartDate && targetDate <= eventEndDate
      })
    },
    [events],
  )

  // Obtener eventos para un rango de fechas
  const getEventsForDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return events.filter((event) => {
        const eventStartDate = new Date(event.start)
        const eventEndDate = new Date(event.end)

        // El evento está dentro del rango si:
        // - Su fecha de inicio está en el rango
        // - Su fecha de fin está en el rango
        // - El evento abarca todo el rango
        return (
          (eventStartDate >= startDate && eventStartDate <= endDate) ||
          (eventEndDate >= startDate && eventEndDate <= endDate) ||
          (eventStartDate <= startDate && eventEndDate >= endDate)
        )
      })
    },
    [events],
  )

  return {
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsForDate,
    getEventsForDateRange,
  }
}
