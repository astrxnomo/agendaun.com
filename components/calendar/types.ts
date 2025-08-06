export type CalendarView = "month" | "week" | "day" | "agenda"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: EventColor
  label?: string // Etiqueta personalizada opcional
  labelId?: string // ID de referencia a etiqueta personalizada
  location?: string
  // Información académica para filtrado
  sede?: string
  facultad?: string
  programa?: string
}

export interface CustomLabel {
  id: string
  name: string
  color: EventColor
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
  | "indigo" // Añil profundo
