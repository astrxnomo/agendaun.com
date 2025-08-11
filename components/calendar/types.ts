export type CalendarView = "month" | "week" | "day" | "agenda"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: EventColor
  location?: string
  // Información académica para filtrado
  sede?: string
  facultad?: string
  programa?: string
}

export interface Etiquette {
  id: string
  name: string
  color: EventColor
  isActive: boolean
}

export type EventColor =
  | "gray" // Por defecto para eventos sin color
  | "blue" // Azul distintivo
  | "red" // Rojo clásico
  | "green" // Verde natural
  | "purple" // Morado vibrante
  | "orange" // Naranja brillante
  | "pink" // Rosa distintivo
  | "teal" // Verde azulado
  | "yellow" // Amarillo brillante
  | "lime" // Añil profundo
