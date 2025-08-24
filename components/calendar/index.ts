// Component exports
export { AgendaView } from "./agenda-view"
export { CalendarDndProvider, useCalendarDnd } from "./calendar-dnd-context"
export { DayView } from "./day-view"
export { DraggableEvent } from "./draggable-event"
export { DroppableCell } from "./droppable-cell"
export { EditModeToggle } from "./edit-mode-toggle"
export { EtiquettesHeader } from "./etiquettes-header"
export { EtiquettesManager } from "./etiquettes-manager"
export { EventDialog } from "./event-dialog"
export { EventItem } from "./event-item"
export { EventViewDialog } from "./event-view-dialog"
export { EventsPopup } from "./events-popup"
export { MonthView } from "./month-view"
export { SetupCalendar } from "./setup-calendar"
export { WeekView } from "./week-view"

export { CalendarProvider, useCalendarContext } from "./calendar-context"

export { default as UniversalCalendar } from "./calendar"

export { useCalendar } from "./hooks/use-calendar"

// Constants and utility exports
export * from "./constants"
export * from "./utils"

export * from "@/components/calendar/calendar-context"
export * from "@/components/calendar/hooks/use-current-time-indicator"
export * from "@/components/calendar/hooks/use-event-visibility"
