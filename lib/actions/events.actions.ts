"use server"

import { Permission, Query, Role } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { db } from "@/lib/appwrite/db"
import { type Events } from "@/types"

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
    faculties_id: event.faculties_id,
    programs_id: event.programs_id,
    calendar_id: event.calendar_id,
    etiquette_id: event.etiquette_id,
  }
}

export async function getEvents(calendarId: string): Promise<Events[]> {
  try {
    const data = await db()
    const result = await data.events.list([
      Query.equal("calendar_id", calendarId),
    ])

    return result.documents as Events[]
  } catch (error) {
    console.error("Error getting events:", error)
    return []
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

    // Limpiar el objeto event de propiedades de Appwrite
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
