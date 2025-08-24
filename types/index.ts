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

export type Events = Models.Document & {
  title: string
  description: string | null
  start: Date
  end: Date
  all_day: boolean
  location: string | null
  sede_id: Sedes["$id"]
  faculty_id: Faculties["$id"] | null
  program_id: Programs["$id"] | null
  calendar_id: Calendars["$id"] | null
  etiquette_id: Events["$id"] | null
}

export type Etiquettes = Models.Document & {
  name: string
  color: Colors
  isActive: boolean
  calendar_id: Calendars["$id"]
}

export type Calendars = Models.Document & {
  name: string | null
  owner_id: User["$id"]
  defaultView: CalendarViews
  slug: string
}

export type Profiles = Models.Document & {
  sede_id: string | null
  faculty_id: Faculties["$id"]
  program_id: Programs["$id"]
  user_id: User["$id"]
}
export type Sedes = Models.Document & {
  name: string
}

export type Faculties = Models.Document & {
  name: string
  sede_id: Sedes["$id"]
}

export type Programs = Models.Document & {
  name: string
  faculty_id: Faculties["$id"]
}

export type Session = Models.Session

export type User = Models.User<Models.Preferences>

export type Team = Models.Team<Models.Preferences>

export type Membership = Models.Membership
