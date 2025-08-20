// Component exports
export { AgendaView } from "./agenda-view"
export { CalendarDndProvider, useCalendarDnd } from "./calendar-dnd-context"
export { DayView } from "./day-view"
export { DraggableEvent } from "./draggable-event"
export { DroppableCell } from "./droppable-cell"
export { EtiquettesHeader } from "./etiquettes-header"
export { EtiquettesManager } from "./etiquettes-manager"
export { EventDialog } from "./event-dialog"
export { EventItem } from "./event-item"
export { EventViewDialog } from "./event-view-dialog"
export { EventsPopup } from "./events-popup"
export { MonthView } from "./month-view"
export { SetupCalendar } from "./setup-calendar"
export { WeekView } from "./week-view"

// Enhanced Calendar System
export { CalendarProvider, useCalendarContext } from "./calendar-context"
export { CalendarDataProvider } from "./calendar-data-context"

export { default as UniversalCalendar } from "./universal-calendar"

// Hook exports - Enhanced System
export { useAcademicFilters } from "./hooks/use-academic-filters"

// Constants and utility exports
export * from "./constants"
export * from "./utils"

// Legacy Hook exports (for backward compatibility)
export * from "@/components/calendar/calendar-context"
export * from "@/components/calendar/hooks/use-calendar"
export * from "@/components/calendar/hooks/use-calendar-permissions"
export * from "@/components/calendar/hooks/use-current-time-indicator"
export * from "@/components/calendar/hooks/use-event-visibility"

// Types
export type { CalendarType } from "./calendar-data-context"
export type { CalendarPermissions } from "./hooks/use-calendar-permissions"
