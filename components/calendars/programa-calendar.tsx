"use client"

import { CalendarDataProvider } from "@/components/calendar/calendar-data-context"
import EnhancedCalendar from "@/components/calendar/enhanced-calendar"

import type { Calendars } from "@/types"

interface ProgramaCalendarProps {
  calendar: Calendars // Calendario único de programa
  showStats?: boolean
  compact?: boolean
}

export default function ProgramaCalendar({
  calendar,
  showStats = false,
  compact = false,
}: ProgramaCalendarProps) {
  return (
    <CalendarDataProvider calendar={calendar}>
      <EnhancedCalendar
        calendar={calendar}
        defaultView="month"
        showStats={showStats}
        showHeader={!compact}
        enableFilters={true} // Programa necesita filtros académicos
        enableRealTime={true}
        className={compact ? "border-none shadow-sm" : ""}
      />
    </CalendarDataProvider>
  )
}
