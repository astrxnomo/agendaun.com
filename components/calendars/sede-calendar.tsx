"use client"

import { CalendarDataProvider } from "@/components/calendar/calendar-data-context"
import EnhancedCalendar from "@/components/calendar/enhanced-calendar"

import type { Calendars } from "@/types"

interface SedeCalendarProps {
  calendar: Calendars // Calendario único de sede
  showStats?: boolean
  compact?: boolean
}

export default function SedeCalendar({
  calendar,
  showStats = false,
  compact = false,
}: SedeCalendarProps) {
  return (
    <CalendarDataProvider calendar={calendar}>
      <EnhancedCalendar
        calendar={calendar}
        defaultView="month"
        showStats={showStats}
        showHeader={!compact}
        enableFilters={true} // Sede necesita filtros académicos
        enableRealTime={true}
        className={compact ? "border-none shadow-sm" : ""}
      />
    </CalendarDataProvider>
  )
}
