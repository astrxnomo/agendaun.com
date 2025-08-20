"use client"

import { CalendarDataProvider } from "@/components/calendar/calendar-data-context"
import EnhancedCalendar from "@/components/calendar/enhanced-calendar"

import type { Calendars } from "@/types"

interface FacultadCalendarProps {
  calendar: Calendars // Calendario único de facultad
  showStats?: boolean
  compact?: boolean
}

export default function FacultadCalendar({
  calendar,
  showStats = false,
  compact = false,
}: FacultadCalendarProps) {
  return (
    <CalendarDataProvider calendar={calendar}>
      <EnhancedCalendar
        calendar={calendar}
        defaultView="month"
        showStats={showStats}
        showHeader={!compact}
        enableFilters={true} // Facultad necesita filtros académicos
        enableRealTime={true}
        className={compact ? "border-none shadow-sm" : ""}
      />
    </CalendarDataProvider>
  )
}
