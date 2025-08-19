"use server"

import { getUser } from "@/lib/appwrite/auth"

import { getOrCreatePersonalCalendar } from "./calendars.actions"
import { getEtiquettes } from "./etiquettes.actions"
import { getEvents } from "./events.actions"

import type { Calendars, Etiquettes, Events } from "@/types"

export interface PersonalCalendarData {
  user: any
  calendar: Calendars
  events: Events[]
  etiquettes: Etiquettes[]
}

export async function getPersonalCalendarData(): Promise<PersonalCalendarData | null> {
  try {
    // 1. Verificar autenticación
    const user = await getUser()
    if (!user) return null

    // 2. Obtener o crear calendario personal
    const calendar = await getOrCreatePersonalCalendar(user.$id)
    if (!calendar) return null

    // 3. Obtener eventos y etiquetas del calendario
    const [events, etiquettes] = await Promise.all([
      getEvents(calendar.$id),
      getEtiquettes(calendar.$id),
    ])

    return {
      user,
      calendar,
      events,
      etiquettes,
    }
  } catch (error) {
    console.error("Error getting personal calendar data:", error)
    return null
  }
}
