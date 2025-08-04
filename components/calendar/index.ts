"use client"

// Component exports
export { AgendaView } from "@/components/calendar/agenda-view"
export {
  CalendarDndProvider,
  useCalendarDnd,
} from "@/components/calendar/calendar-dnd-context"
export { DayView } from "@/components/calendar/day-view"
export { DraggableEvent } from "@/components/calendar/draggable-event"
export { DroppableCell } from "@/components/calendar/droppable-cell"
export { EventCalendar } from "@/components/calendar/event-calendar"
export { EventDialog } from "@/components/calendar/event-dialog"
export { EventItem } from "@/components/calendar/event-item"
export { EventsPopup } from "@/components/calendar/events-popup"
export { MonthView } from "@/components/calendar/month-view"
export { WeekView } from "@/components/calendar/week-view"

// Constants and utility exports
export * from "@/components/calendar/constants"
export * from "@/components/calendar/utils"

// Hook exports
export * from "@/components/calendar/use-current-time-indicator"
export * from "@/components/calendar/use-event-visibility"

// Type exports
export type {
  CalendarEvent,
  CalendarView,
  EventColor,
} from "@/components/calendar/types"
