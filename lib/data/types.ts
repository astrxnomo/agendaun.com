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
export type Sedes = Models.Row & {
  name: string
  faculties: Faculties[]
}

export type Faculties = Models.Row & {
  name: string
  programs: Programs[]
  sede: Sedes
}

export type Programs = Models.Row & {
  name: string
  faculty: Faculties
}

export type CalendarEvents = Models.Row & {
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
  image: string | null
  created_by: Profiles
}

export type ScheduleEvents = Models.Row & {
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
  image: string | null
}

export type CalendarEtiquettes = Models.Row & {
  name: string
  color: Colors
  isActive: boolean
  calendar: Calendars
}

export type Calendars = Models.Row & {
  name: string | null
  defaultView: DefaultView
  slug: string
  profile: Profiles | null
  etiquettes: CalendarEtiquettes[]
  requireConfig: boolean
  icon: string | null
}

export type Schedules = Models.Row & {
  name: string | null
  description: string | null
  sede: Sedes
  faculty: Faculties | null
  program: Programs | null
  category: ScheduleCategories
  start_hour: number
  end_hour: number
}

export type ScheduleCategories = Models.Row & {
  name: string
  slug: string
  icon: string | null
}

export type Profiles = Models.Row & {
  user_id: string
  email: string
  sede: Sedes
  faculty: Faculties
  program: Programs
}

export type User = Models.User<Models.Preferences>
