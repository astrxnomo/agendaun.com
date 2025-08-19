"use client"

// Component exports
export { AgendaView } from "./agenda-view"
export { CalendarDndProvider, useCalendarDnd } from "./calendar-dnd-context"
export { DayView } from "./day-view"
export { DraggableEvent } from "./draggable-event"
export { DroppableCell } from "./droppable-cell"
export { EtiquettesHeader } from "./etiquettes-header"
export { EventDialog } from "./event-dialog"
export { EventItem } from "./event-item"
export { EventViewDialog } from "./event-view-dialog"
export { EventsPopup } from "./events-popup"
export { MonthView } from "./month-view"
export { SetupCalendar } from "./setup-calendar"
export { WeekView } from "./week-view"

// Constants and utility exports
export * from "./constants"
export * from "./utils"

// Hook exports
export * from "@/components/calendar/calendar-context"
export * from "@/components/calendar/hooks/use-calendar-manager"
export * from "@/components/calendar/hooks/use-calendar-permissions"
export * from "@/components/calendar/hooks/use-current-time-indicator"
export * from "@/components/calendar/hooks/use-event-visibility"

// Types
export type { CalendarPermissions } from "./hooks/use-calendar-permissions"

