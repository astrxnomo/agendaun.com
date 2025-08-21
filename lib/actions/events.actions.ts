"use server"

import { Permission, Query, Role } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { db } from "@/lib/appwrite/db"
import { type Calendars, type Events, type Profiles } from "@/types"

/**
 * Limpia el objeto event de propiedades de Appwrite que no deben enviarse
 */
function cleanEventData(event: Partial<Events>) {
  return {
    title: event.title,
    description: event.description,
    start: event.start,
    end: event.end,
    all_day: event.all_day,
    location: event.location,
    sede_id: event.sede_id,
    faculties_id: event.faculty_id,
    programs_id: event.program_id,
    calendar_id: event.calendar_id,
    etiquette_id: event.etiquette_id,
  }
}

export async function getCalendarEvents(
  calendar: Calendars,
  profile: Profiles | null,
): Promise<Events[]> {
  try {
    const data = await db()
    const queries = []

    if (!calendar?.$id) {
      return []
    }

    queries.push(Query.equal("calendar_id", calendar.$id))

    if (calendar.slug === "national-calendar") {
    } else if (calendar.slug === "sede-calendar") {
      if (!profile?.sede_id) {
        return []
      }
      queries.push(Query.equal("sede_id", profile.sede_id))
    } else if (calendar.slug === "facultad-calendar") {
      if (!profile?.faculty_id) {
        return []
      }
      queries.push(Query.equal("faculty_id", profile.faculty_id))
    } else if (calendar.slug === "programa-calendar") {
      if (!profile?.program_id) {
        return []
      }
      queries.push(Query.equal("program_id", profile.program_id))
    } else {
      if (!profile?.user_id) {
        return []
      }
      queries.push(Query.equal("owner_id", profile.user_id))
    }

    const result = await data.events.list(queries)

    return result.documents as Events[]
  } catch (error) {
    throw error
  }
}

export async function createEvent(
  event: Partial<Events>,
): Promise<Events | null> {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not authenticated")

    const data = await db()

    // Limpiar el objeto event de propiedades de Appwrite
    const cleanEvent = cleanEventData(event)

    // Para eventos personales, solo el usuario creador tiene permisos completos
    const permissions = [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ]

    const result = await data.events.create(cleanEvent, permissions)
    return result as Events
  } catch (error) {
    console.error("Error creating event:", error)
    return null
  }
}

export async function updateEvent(
  eventId: string,
  event: Partial<Events>,
): Promise<Events | null> {
  try {
    const data = await db()

    const cleanEvent = cleanEventData(event)

    const result = await data.events.update(eventId, cleanEvent)
    return result as Events
  } catch (error) {
    console.error("Error updating event:", error)
    return null
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const data = await db()
    await data.events.delete(eventId)
    return true
  } catch (error) {
    console.error("Error deleting event:", error)
    return false
  }
}
