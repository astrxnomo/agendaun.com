"use client"

import { CalendarProvider } from "./calendar-context"
import { EventCalendar, type EventCalendarProps } from "./event-calendar"

/**
 * EventCalendar con CalendarProvider incluido automáticamente.
 * Use este componente en lugar de EventCalendar directamente para evitar
 * tener que envolver manualmente con CalendarProvider.
 */
export function WrappedEventCalendar(props: EventCalendarProps) {
  return (
    <CalendarProvider>
      <EventCalendar {...props} />
    </CalendarProvider>
  )
}

export type { EventCalendarProps }
