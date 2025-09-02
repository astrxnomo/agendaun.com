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

export type Events = Models.Document & {
  title: string
  description: string | null
  start: string
  end: string | null
  all_day: boolean
  location: string | null
  calendar: Calendars
  etiquette: Etiquettes
  sede: Sedes
  faculty: Faculties
  program: Programs
}

export type Etiquettes = Models.Document & {
  name: string
  color: Colors
  isActive: boolean
  calendar: Calendars
}

export type Calendars = Models.Document & {
  name: string | null
  defaultView: DefaultView
  slug: string
  profiles: Profiles
  etiquettes: Etiquettes[]
}

export type Profiles = Models.Document & {
  user_id: string
  sede: Sedes
  faculty: Faculties
  program: Programs
}

export type Session = Models.Session

export type User = Models.User<Models.Preferences>

export type Team = Models.Team<Models.Preferences>

export type Membership = Models.Membership
