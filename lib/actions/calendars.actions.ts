"use server"

import { Permission, Query, Role } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { db } from "@/lib/appwrite/db"
import { CalendarViews, type Calendars } from "@/types"

export async function getCalendar(slug: string): Promise<Calendars | null> {
  try {
    const data = await db()
    const result = await data.calendars.list([Query.equal("slug", slug)])
    return (result.documents[0] as Calendars) || null
  } catch (error) {
    console.error("Error getting calendar:", error)
    return null
  }
}

export async function getPersonalCalendar(
  userId: string,
): Promise<Calendars | null> {
  try {
    const data = await db()
    const result = await data.calendars.list([Query.equal("owner_id", userId)])
    return (result.documents[0] as Calendars) || null
  } catch (error) {
    console.error("Error getting personal calendar:", error)
    return null
  }
}

export async function createPersonalCalendar(
  calendarData: Partial<Calendars>,
): Promise<Calendars | null> {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not authenticated")

    const data = await db()

    // Para calendarios personales, solo el propietario tiene permisos completos
    const permissions = [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ]

    // Limpiar los datos del calendario
    const cleanCalendar = {
      name: calendarData.name,
      team_id: calendarData.team_id,
      defaultView: calendarData.defaultView,
      slug: calendarData.slug,
      owner_id: user.$id,
    }

    const result = await data.calendars.create(cleanCalendar, permissions)
    return result as Calendars
  } catch (error) {
    console.error("Error creating personal calendar:", error)
    return null
  }
}

export async function getOrCreatePersonalCalendar(
  userId: string,
): Promise<Calendars | null> {
  try {
    // Primero intentamos obtener el calendario existente
    let personalCalendar = await getPersonalCalendar(userId)

    if (!personalCalendar) {
      // Si no existe, creamos uno nuevo
      const calendarData = {
        name: "Calendario Personal",
        defaultView: CalendarViews.WEEK,
        slug: `personal-${userId}`,
      }

      personalCalendar = await createPersonalCalendar(calendarData)
    }

    return personalCalendar
  } catch (error) {
    console.error("Error getting or creating personal calendar:", error)
    return null
  }
}
