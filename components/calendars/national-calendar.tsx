"use client"

import { CalendarDataProvider } from "@/components/calendar/calendar-data-context"
import EnhancedCalendar from "@/components/calendar/enhanced-calendar"

import type { Calendars } from "@/types"

interface NationalCalendarProps {
  calendar: Calendars
  showStats?: boolean
  compact?: boolean
}

export default function NationalCalendar({
  calendar,
  showStats = false,
  compact = false,
}: NationalCalendarProps) {
  return (
    <CalendarDataProvider calendar={calendar}>
      <EnhancedCalendar
        calendar={calendar}
        defaultView="month"
        showStats={showStats}
        showHeader={!compact}
        enableFilters={false} // Nacional no necesita filtros académicos
        enableRealTime={true}
        className={compact ? "border-none shadow-sm" : ""}
      />
    </CalendarDataProvider>
  )
}
