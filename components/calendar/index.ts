// 🎯 Exportaciones principales del sistema de calendario optimizado

// Tipos base
export type {
  CalendarEvent,
  CalendarView,
  EventColor,
  RecurrenceRule,
  TutoringEvent,
  TutoringEventMetadata,
  UniversityEventMetadata,
} from "./types"

// Componentes de calendario base
export { AgendaView } from "./agenda-view"
export { DayView } from "./day-view"
export { DraggableEvent } from "./draggable-event"
export { DroppableCell } from "./droppable-cell"
export { EventCalendar } from "./event-calendar"
export { EventDialog } from "./event-dialog"
export { EventItem } from "./event-item"
export { EventsPopup } from "./events-popup"
export { MonthView } from "./month-view"
export { WeekView } from "./week-view"
export { WrappedEventCalendar } from "./wrapped-event-calendar"

// Componentes especializados optimizados
export { TutoringCalendar } from "./schedules/tutoring-calendar"

// Hooks optimizados
export {
  useFilteredTutoringEvents,
  useTutoringEvents,
} from "./hooks/use-tutoring-events"

// Adaptadores para integración
export {
  TutoringCalendarAdapter,
  TutoringListAdapter,
  TutoringStatsAdapter,
} from "./adapters/tutoring-adapters"

// Contextos y providers
export { CalendarDndProvider, useCalendarDnd } from "./calendar-dnd-context"

// Hooks de utilidades
export * from "./use-current-time-indicator"
export * from "./use-event-visibility"

// Constantes y utilidades
export * from "./constants"
export * from "./utils"
