import { isSameDay } from "date-fns"

import { type CalendarEvents } from "@/lib/data/types"

/**
 * Check if an event is a multi-day event
 */
export function isMultiDayEvent(event: CalendarEvents): boolean {
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end || event.start)
  return event.all_day || eventStart.getDate() !== eventEnd.getDate()
}

/**
 * Get the duration of an event in milliseconds
 */
export function getEventDuration(event: CalendarEvents): number {
  return new Date(event.end).getTime() - new Date(event.start).getTime()
}

/**
 * Filter events for a specific day
 */
export function getEventsForDay(
  events: CalendarEvents[],
  day: Date,
): CalendarEvents[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start)
      return isSameDay(day, eventStart)
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

/**
 * Sort events with multi-day events first (longest first), then by start time
 */
export function sortEvents(events: CalendarEvents[]): CalendarEvents[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a)
    const bIsMultiDay = isMultiDayEvent(b)

    // Both are multi-day: sort by duration (longest first), then by start time
    if (aIsMultiDay && bIsMultiDay) {
      const aDuration = getEventDuration(a)
      const bDuration = getEventDuration(b)

      // If durations are different, longest first
      if (aDuration !== bDuration) {
        return bDuration - aDuration
      }

      // If same duration, sort by start time
      return new Date(a.start).getTime() - new Date(b.start).getTime()
    }

    // Multi-day events come before single-day events
    if (aIsMultiDay && !bIsMultiDay) return -1
    if (!aIsMultiDay && bIsMultiDay) return 1

    // Both are single-day: sort by start time
    return new Date(a.start).getTime() - new Date(b.start).getTime()
  })
}

/**
 * Get multi-day events that span across a specific day (but don't start on that day)
 */
export function getSpanningEventsForDay(
  events: CalendarEvents[],
  day: Date,
): CalendarEvents[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) return false

    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end || event.start)

    // Only include if it's not the start day but is either the end day or a middle day
    return (
      !isSameDay(day, eventStart) &&
      (isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
    )
  })
}

/**
 * Get all events visible on a specific day (starting, ending, or spanning)
 */
export function getAllEventsForDay(
  events: CalendarEvents[],
  day: Date,
): CalendarEvents[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end || event.start)
    return (
      isSameDay(day, eventStart) ||
      isSameDay(day, eventEnd) ||
      (day > eventStart && day < eventEnd)
    )
  })
}

/**
 * Get all events for a day (for agenda view)
 */
export function getAgendaEventsForDay(
  events: CalendarEvents[],
  day: Date,
): CalendarEvents[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end || event.start)
      return (
        isSameDay(day, eventStart) ||
        isSameDay(day, eventEnd) ||
        (day > eventStart && day < eventEnd)
      )
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

/**
 * Add hours to a date
 */
export function addHoursToDate(date: Date, hours: number): Date {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}
