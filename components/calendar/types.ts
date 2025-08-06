export type CalendarView = "month" | "week" | "day" | "agenda"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: EventColor
  label?: string
  location?: string
  // Información académica para filtrado
  sede?: string
  facultad?: string
  programa?: string
}

export type EventColor =
  | "blue"
  | "orange"
  | "violet"
  | "rose"
  | "emerald"
  | "red"
  | "yellow"
  | "green"
  | "cyan"
  | "purple"
  | "pink"
  | "indigo"
  | "teal"
  | "lime"
  | "amber"
