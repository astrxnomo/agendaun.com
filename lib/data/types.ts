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
  days_of_week: number[]
  start_hour: number
  start_minute: number
  end_hour: number
  end_minute: number
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
