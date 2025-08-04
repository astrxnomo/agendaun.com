import { addDays, isSameDay } from "date-fns"

import { type EventColor } from "@/components/calendar/types"

import type { CalendarEvent } from "@/components/calendar/event-calendar"

/**
 * Get CSS classes for event colors
 */
export function getEventColorClasses(color?: EventColor): string {
  const eventColor = color || "sky"

  switch (eventColor) {
    case "sky":
      return "bg-blue-200/50 hover:bg-blue-200/40 text-blue-900/90 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200 shadow-blue-700/8"
    case "violet":
      return "bg-violet-200/50 hover:bg-violet-200/40 text-violet-900/90 dark:bg-violet-400/25 dark:hover:bg-violet-400/20 dark:text-violet-200 shadow-violet-700/8"
    case "rose":
      return "bg-rose-200/50 hover:bg-rose-200/40 text-rose-900/90 dark:bg-rose-400/25 dark:hover:bg-rose-400/20 dark:text-rose-200 shadow-rose-700/8"
    case "emerald":
      return "bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-900/90 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 shadow-emerald-700/8"
    case "orange":
      return "bg-orange-200/50 hover:bg-orange-200/40 text-orange-900/90 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200 shadow-orange-700/8"
    default:
      return "bg-blue-200/50 hover:bg-blue-200/40 text-blue-900/90 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200 shadow-blue-700/8"
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
    return "rounded-r rounded-l-none not-in-data-[slot=popover-content]:w-[calc(100%+4px)] not-in-data-[slot=popover-content]:-translate-x-[4px]" // Only right end rounded
  } else {
    return "rounded-none not-in-data-[slot=popover-content]:w-[calc(100%+9px)] not-in-data-[slot=popover-content]:-translate-x-[4px]" // No rounded corners
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

/**
 * Generate recurring events based on recurrence rule
 */
export function generateRecurringEvents(
  baseEvent: CalendarEvent,
  viewStart?: Date,
  viewEnd?: Date,
): CalendarEvent[] {
  if (!baseEvent.recurrence || baseEvent.recurrence.type === "none") {
    return [baseEvent]
  }

  const events: CalendarEvent[] = []
  const { type, interval, endDate, count, daysOfWeek } = baseEvent.recurrence
  const eventDuration =
    new Date(baseEvent.end).getTime() - new Date(baseEvent.start).getTime()

  // For weekly recurrence with specific days
  if (type === "weekly" && daysOfWeek && daysOfWeek.length > 0) {
    return generateWeeklyEventsForSpecificDays(
      baseEvent,
      daysOfWeek,
      interval,
      endDate,
      count,
      eventDuration,
      viewStart,
      viewEnd,
    )
  }

  const currentStart = new Date(baseEvent.start)
  let occurrenceCount = 0

  // Calculate effective end date for infinite recurrence
  const maxFutureDate = viewEnd
    ? addDays(viewEnd, 60) // Generate 60 days beyond current view
    : addDays(new Date(), 730) // Default: 2 years from now

  const effectiveEndDate = endDate || maxFutureDate

  // Continue until end date or count limit is reached
  while (
    currentStart <= effectiveEndDate &&
    (!count || occurrenceCount < count) &&
    occurrenceCount < 2000 // Safety limit to prevent infinite loops
  ) {
    // Skip events that are way before the view window (optimization)
    if (viewStart && currentStart < addDays(viewStart, -30)) {
      // Jump ahead efficiently for events that are too far in the past
      const daysDiff = Math.floor(
        (viewStart.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24),
      )

      if (type === "daily") {
        const jumps = Math.floor(daysDiff / interval)
        currentStart.setDate(currentStart.getDate() + jumps * interval)
        occurrenceCount += jumps
      } else if (type === "weekly") {
        const jumps = Math.floor(daysDiff / (7 * interval))
        currentStart.setDate(currentStart.getDate() + jumps * 7 * interval)
        occurrenceCount += jumps
      }

      continue
    }

    const currentEnd = new Date(currentStart.getTime() + eventDuration)

    // Only include events that are within or near the view window
    if (!viewEnd || currentStart <= addDays(viewEnd, 30)) {
      // Create event instance
      events.push({
        ...baseEvent,
        id: `${baseEvent.id}-${occurrenceCount}`,
        seriesId: baseEvent.id, // Use original event ID as series ID
        start: new Date(currentStart),
        end: currentEnd,
      })
    }

    occurrenceCount++

    // Calculate next occurrence
    switch (type) {
      case "daily":
        currentStart.setDate(currentStart.getDate() + interval)
        break
      case "weekly":
        currentStart.setDate(currentStart.getDate() + 7 * interval)
        break
      case "monthly":
        currentStart.setMonth(currentStart.getMonth() + interval)
        break
      default:
        return events // Stop if unknown type
    }

    // Early exit if we've gone too far beyond the view
    if (viewEnd && currentStart > addDays(viewEnd, 60)) {
      break
    }
  }

  return events
}

/**
 * Generate weekly events for specific days of the week
 */
function generateWeeklyEventsForSpecificDays(
  baseEvent: CalendarEvent,
  daysOfWeek: number[],
  interval: number,
  endDate?: Date,
  count?: number,
  eventDuration?: number,
  viewStart?: Date,
  viewEnd?: Date,
): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const startDate = new Date(baseEvent.start)
  const startOfWeek = new Date(startDate)

  // Get to the start of the week (Sunday)
  startOfWeek.setDate(startDate.getDate() - startDate.getDay())

  let occurrenceCount = 0
  const duration =
    eventDuration ||
    new Date(baseEvent.end).getTime() - new Date(baseEvent.start).getTime()

  // Calculate effective end date for infinite recurrence
  const maxFutureDate = viewEnd
    ? addDays(viewEnd, 60)
    : addDays(new Date(), 730)

  const effectiveEndDate = endDate || maxFutureDate

  while (
    startOfWeek <= effectiveEndDate &&
    (!count || occurrenceCount < count) &&
    occurrenceCount < 2000 // Safety limit
  ) {
    // For each selected day in this week
    for (const dayOfWeek of daysOfWeek.sort()) {
      if (count && occurrenceCount >= count) break

      const eventDate = new Date(startOfWeek)
      eventDate.setDate(startOfWeek.getDate() + dayOfWeek)

      // Set the time from the original event
      eventDate.setHours(
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds(),
        startDate.getMilliseconds(),
      )

      // Only add if the date is not before our start date and not after end date
      if (eventDate >= startDate && (!endDate || eventDate <= endDate)) {
        const eventEnd = new Date(eventDate.getTime() + duration)

        events.push({
          ...baseEvent,
          id: `${baseEvent.id}-${occurrenceCount}`,
          seriesId: baseEvent.id, // Use original event ID as series ID
          start: new Date(eventDate),
          end: eventEnd,
        })

        occurrenceCount++
      }
    }

    // Move to next week interval
    startOfWeek.setDate(startOfWeek.getDate() + 7 * interval)
  }

  return events
}

/**
 * Process events to expand recurring ones
 */
export function processEventsWithRecurrence(
  events: CalendarEvent[],
  viewStart?: Date,
  viewEnd?: Date,
): CalendarEvent[] {
  const processedEvents: CalendarEvent[] = []

  events.forEach((event) => {
    if (event.recurrence && event.recurrence.type !== "none") {
      const recurringEvents = generateRecurringEvents(event, viewStart, viewEnd)
      processedEvents.push(...recurringEvents)
    } else {
      processedEvents.push(event)
    }
  })

  return processedEvents.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  )
}

/**
 * Get all events in the same recurring series
 */
export function getEventSeries(
  events: CalendarEvent[],
  seriesId: string,
): CalendarEvent[] {
  return events.filter((event) => event.seriesId === seriesId)
}

/**
 * Remove all events in a recurring series
 */
export function removeEventSeries(
  events: CalendarEvent[],
  seriesId: string,
): CalendarEvent[] {
  return events.filter((event) => event.id !== seriesId)
}

/**
 * Update a base recurring event (which will regenerate all instances)
 */
export function updateEventSeries(
  events: CalendarEvent[],
  seriesId: string,
  updates: Partial<CalendarEvent>,
): CalendarEvent[] {
  return events.map((event) => {
    // Update the base event (the one that defines the series)
    if (event.id === seriesId) {
      return {
        ...event,
        ...updates,
      }
    }
    return event
  })
}

/**
 * Check if an event is part of a recurring series
 */
export function isRecurringEvent(event: CalendarEvent): boolean {
  return !!event.seriesId
}

/**
 * Find the base event for a recurring series
 */
export function findBaseEventForSeries(
  events: CalendarEvent[],
  seriesId: string,
): CalendarEvent | undefined {
  return events.find((event) => event.id === seriesId)
}
