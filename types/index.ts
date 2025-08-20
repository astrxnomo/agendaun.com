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
  faculties_id: Faculties["$id"]
  programs_id: Programs["$id"]
  calendar_id: Calendars["$id"]
  etiquette_id: Events["$id"]
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

export interface User {
  $id: string
  $createdAt: string
  $updatedAt: string
  name: string
  email: string
  emailVerification: boolean
  status: boolean
  labels: string[]
  targets: Array<{
    $id: string
    $createdAt: string
    $updatedAt: string
    name: string
    userId: string
    providerId?: string
    providerType: string
    identifier: string
  }>
  prefs: Record<string, any>
  accessedAt: string
}

export interface Session {
  $id: string
  $createdAt: string
  $updatedAt: string
  userId: string
  expire: string
  provider: string
  providerUid: string
  providerAccessToken: string
  providerAccessTokenExpiry: string
  providerRefreshToken: string
  ip: string
  osCode: string
  osName: string
  osVersion: string
  clientType: string
  clientCode: string
  clientName: string
  clientVersion: string
  clientEngine: string
  clientEngineVersion: string
  deviceName: string
  deviceBrand: string
  deviceModel: string
  countryCode: string
  countryName: string
  current: boolean
  factors: string[]
  secret: string
}
