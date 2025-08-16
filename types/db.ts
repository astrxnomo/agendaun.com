import { type Models } from "node-appwrite"

export enum DefaultView {
  AGENDA = "agenda",
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
}

export enum Color {
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

export type Profiles = Models.Document & {}

export type Events = Models.Document & {
  calendars: Calendars
  title: string
  description: string | null
  start: Date
  end?: Date | null
  all_day?: boolean
  etiquettes: Etiquettes
  location?: string | null
  sedes?: Sedes
  faculties?: Faculties
  programs?: Programs
}

export type Calendars = Models.Document & {
  name: string | null
  team_id: string | null
  defaultView: DefaultView
  slug: string
}

export type Etiquettes = Models.Document & {
  name: string
  color: Color
  isActive: boolean
  calendars: Calendars
}

export type Sedes = Models.Document & {
  name: string
  slug: string
}

export type Faculties = Models.Document & {
  name: string
  slug: string
  sedes: Sedes
}

export type Programs = Models.Document & {
  name: string
  slug: string
  faculties: Faculties
}
