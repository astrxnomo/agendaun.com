import { isSameDay } from "date-fns"

import {
  type CalendarEvent,
  type EventColor,
} from "@/components/calendar/types"

/**
 * Get CSS classes for event colors using centralized color system
 */
export function getEventColorClasses(color?: EventColor): string {
  const eventColor = color || "gray"

  // Usar clases hardcodeadas para garantizar que Tailwind las compile
  switch (eventColor) {
    case "gray":
      return "bg-gray-400/60 hover:bg-gray-500/50 text-gray-900 border border-gray-300/40 shadow-sm"
    case "blue":
      return "bg-blue-200/50 hover:bg-blue-200/40 text-blue-900/90 shadow-blue-700/8 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200"
    case "red":
      return "bg-red-200/50 hover:bg-red-200/40 text-red-900/90 shadow-red-700/8 dark:bg-red-400/25 dark:hover:bg-red-400/20 dark:text-red-200"
    case "green":
      return "bg-green-200/50 hover:bg-green-200/40 text-green-900/90 shadow-green-700/8 dark:bg-green-400/25 dark:hover:bg-green-400/20 dark:text-green-200"
    case "purple":
      return "bg-purple-200/50 hover:bg-purple-200/40 text-purple-900/90 shadow-purple-700/8 dark:bg-purple-400/25 dark:hover:bg-purple-400/20 dark:text-purple-200"
    case "orange":
      return "bg-orange-200/50 hover:bg-orange-200/40 text-orange-900/90 shadow-orange-700/8 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200"
    case "pink":
      return "bg-pink-200/50 hover:bg-pink-200/40 text-pink-900/90 shadow-pink-700/8 dark:bg-pink-400/25 dark:hover:bg-pink-400/20 dark:text-pink-200"
    case "teal":
      return "bg-teal-200/50 hover:bg-teal-200/40 text-teal-900/90 shadow-teal-700/8 dark:bg-teal-400/25 dark:hover:bg-teal-400/20 dark:text-teal-200"
    case "yellow":
      return "bg-yellow-200/50 hover:bg-yellow-200/40 text-yellow-900/90 shadow-yellow-700/8 dark:bg-yellow-400/25 dark:hover:bg-yellow-400/20 dark:text-yellow-200"
    case "indigo":
      return "bg-indigo-200/50 hover:bg-indigo-200/40 text-indigo-900/90 shadow-indigo-700/8 dark:bg-indigo-400/25 dark:hover:bg-indigo-400/20 dark:text-indigo-200"
    default:
      return "bg-gray-400/60 hover:bg-gray-500/50 text-gray-900 border border-gray-300/40 shadow-sm"
  }
}

/**
 * Get CSS classes for border radius based on event position in multi-day events
 */
export function getBorderRadiusClasses(
  isFirstDay: boolean,
  isLastDay: boolean,
): string {
  if (isFirstDay && isLastDay) {
    return "rounded" // Both ends rounded
  } else if (isFirstDay) {
    return "rounded-l rounded-r-none not-in-data-[slot=popover-content]:w-[calc(100%+5px)]" // Only left end rounded
  } else if (isLastDay) {
    return "rounded-r rounded-l-none not-in-data-[slot=popover-content]:w-[calc(100%+4px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"
  } else {
    return "rounded-none not-in-data-[slot=popover-content]:w-[calc(100%+9px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"
  }
}

/**
 * Check if an event is a multi-day event
 */
export function isMultiDayEvent(event: CalendarEvent): boolean {
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)
  return event.allDay || eventStart.getDate() !== eventEnd.getDate()
}

/**
 * Filter events for a specific day
 */
export function getEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start)
      return isSameDay(day, eventStart)
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

/**
 * Sort events with multi-day events first, then by start time
 */
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a)
    const bIsMultiDay = isMultiDayEvent(b)

    if (aIsMultiDay && !bIsMultiDay) return -1
    if (!aIsMultiDay && bIsMultiDay) return 1

    return new Date(a.start).getTime() - new Date(b.start).getTime()
  })
}

/**
 * Get multi-day events that span across a specific day (but don't start on that day)
 */
export function getSpanningEventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) return false

    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

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
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
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
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
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
