import { type Models } from "node-appwrite"

export enum Colors {
  GRAY = "gray",
  BLUE = "blue",
  RED = "red",
  GREEN = "green",
  PURPLE = "purple",
  ORANGE = "orange",
  PINK = "pink",
  TEAL = "teal",
  YELLOW = "yellow",
  LIME = "lime",
}

export enum CalendarViews {
  AGENDA = "agenda",
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
}

export enum DefaultView {
  AGENDA = "agenda",
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
}
export type Sedes = Models.Document & {
  name: string
  faculties: Faculties[]
}

export type Faculties = Models.Document & {
  name: string
  programs: Programs[]
  sede: Sedes
}

export type Programs = Models.Document & {
  name: string
  faculty: Faculties
}

export type CalendarEvents = Models.Document & {
  title: string
  description: string | null
  start: Date
  end: Date
  all_day: boolean
  location: string | null
  calendar: Calendars
  etiquette: CalendarEtiquettes
  sede: Sedes
  faculty: Faculties
  program: Programs
}

export type ScheduleEvents = Models.Document & {
  title: string
  description: string | null
  location: string | null
  schedule: Schedules
  color: Colors
  // Campos para eventos recurrentes en múltiples días
  days_of_week: number[] // Array de días: 1=Lunes, 2=Martes, ..., 7=Domingo
  start_hour: number // Hora de inicio: 0-23
  start_minute: number // Minuto de inicio: 0-59
  end_hour: number // Hora de fin: 0-23
  end_minute: number // Minuto de fin: 0-59
}

export type CalendarEtiquettes = Models.Document & {
  name: string
  color: Colors
  isActive: boolean
  calendar: Calendars
}

export type Calendars = Models.Document & {
  name: string | null
  defaultView: DefaultView
  slug: string
  profile: Profiles | null
  etiquettes: CalendarEtiquettes[]
  requireConfig: boolean
  icon: string | null
}

export type Schedules = Models.Document & {
  name: string | null
  description: string | null
  sede: Sedes
  faculty: Faculties | null
  program: Programs | null
  category: ScheduleCategories
}

export type ScheduleCategories = Models.Document & {
  name: string
  slug: string
  icon: string | null
}

export type Profiles = Models.Document & {
  user_id: string
  sede: Sedes
  faculty: Faculties
  program: Programs
}

export type User = Models.User<Models.Preferences>
