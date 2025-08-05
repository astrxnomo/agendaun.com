export type CalendarView = "month" | "week" | "day" | "agenda"

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly"

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday, 1 = Monday, etc.

export interface RecurrenceRule {
  type: RecurrenceType
  interval: number // Every X days/weeks/months
  endDate?: Date
  count?: number // Alternative to endDate - repeat X times
  daysOfWeek?: DayOfWeek[] // For weekly recurrence, which days
}

// 🎯 Metadatos universitarios OPTIMIZADOS - Alineados con filtros principales
export interface UniversityEventMetadata {
  // 🏛️ FILTROS PRINCIPALES (filters-dialog)
  campusId: string // "bog", "med", "man", etc. - REQUERIDO
  facultyId: string // "bog-ing", "med-cie", etc. - REQUERIDO
  studyProgramId: string // "bog-ing-sis", "med-ing-civ", etc. - REQUERIDO

  // 📚 Información del evento
  eventType:
    | "class"
    | "office-hours"
    | "lab"
    | "tutoring"
    | "transport"
    | "administrative"
  eventCode: string // Código único generado
  academicLevel: "undergraduate" | "graduate" | "postgraduate"
  semester: number
  academicYear: number

  // 👨‍🏫 Información específica
  instructor?: string
  location?: string
  building?: string

  // 📊 Capacidad y ocupación
  capacity?: number
  enrolledCount?: number
  waitingList?: number
  isOpen?: boolean

  // 🏷️ Tags para búsqueda y filtrado
  tags: string[] // REQUERIDO para búsqueda

  // 📈 Métricas adicionales
  difficulty?: number // 1-3 o 1-5
  popularity?: number // Porcentaje 0-100
}

// 🎯 Metadatos específicos para MONITORÍAS
export interface TutoringEventMetadata extends UniversityEventMetadata {
  eventType: "tutoring" // Forzar tipo específico

  // Información del monitor
  tutor: string
  tutorId: string
  department: string
  subject: string

  // Configuración de la monitoría
  tutoringLevel: "basic" | "intermediate" | "advanced"
  tutoringType: "individual" | "group" | "workshop"

  // Requisitos y contenido
  requirements?: string[]
  topics: string[]

  // Estado y costos
  status: "available" | "full" | "cancelled"
  cost?: number
}

// 🎯 Evento de calendario base OPTIMIZADO
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
  recurrence?: RecurrenceRule
  seriesId?: string // ID for recurring event series

  // 🏛️ Metadatos universitarios REQUERIDOS
  metadata: UniversityEventMetadata & Record<string, unknown>
}

// 🎯 Evento específico para MONITORÍAS
export interface TutoringEvent extends Omit<CalendarEvent, "metadata"> {
  metadata: TutoringEventMetadata
}

export type EventColor =
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "emerald"
  | "teal"
  | "orange"
  | "rose"
  | "pink"
