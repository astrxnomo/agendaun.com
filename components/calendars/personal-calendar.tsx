"use client"

import { CalendarDataProvider } from "@/components/calendar/calendar-data-context"
import EnhancedCalendar, {
  StatsCalendar,
} from "@/components/calendar/enhanced-calendar"

import type { Calendars } from "@/types"

interface PersonalCalendarProps {
  calendar: Calendars
  showStats?: boolean
  compact?: boolean
  variant?: "default" | "stats" | "minimal"
}

export default function PersonalCalendar({
  calendar,
  showStats = true, // Personal calendar shows stats by default
  compact = false,
  variant = "default",
}: PersonalCalendarProps) {
  // Usar variante específica según el tipo
  const CalendarComponent =
    variant === "stats" ? StatsCalendar : EnhancedCalendar

  return (
    <CalendarDataProvider calendar={calendar}>
      <CalendarComponent
        calendar={calendar}
        defaultView="agenda" // Personal calendar defaults to agenda view
        showStats={showStats}
        showHeader={!compact}
        enableFilters={false} // Personal calendar doesn't need academic filters
        enableRealTime={true}
        className={compact ? "border-none shadow-sm" : ""}
      />
    </CalendarDataProvider>
  )
}
