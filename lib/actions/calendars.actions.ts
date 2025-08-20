"use server"

import { Permission, Query, Role } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { db } from "@/lib/appwrite/db"
import { CalendarViews, Colors, type Calendars } from "@/types"

import { createEtiquette } from "./etiquettes.actions"
import { userHasRole } from "./teams.actions"

/**
 * Crea etiquetas por defecto para un calendario personal
 */
async function createDefaultEtiquettes(calendarId: string) {
  const defaultEtiquettes = [
    { name: "Personal", color: Colors.BLUE },
    { name: "Trabajo", color: Colors.GREEN },
    { name: "Importante", color: Colors.RED },
    { name: "Recordatorio", color: Colors.YELLOW },
  ]

  for (const etiquette of defaultEtiquettes) {
    try {
      await createEtiquette({
        name: etiquette.name,
        color: etiquette.color,
        isActive: true,
        calendar_id: calendarId,
      })
    } catch (error) {
      console.error(
        `Error creating default etiquette ${etiquette.name}:`,
        error,
      )
    }
  }
}

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

/**
 * Obtiene los permisos específicos que tiene el usuario actual sobre un calendario
 */
export async function getCalendarPermissions(calendarId: string) {
  try {
    const user = await getUser()
    if (!user) {
      return {
        canRead: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
      }
    }

    const data = await db()
    const calendar = await data.calendars.get(calendarId)

    if (!calendar) {
      return {
        canRead: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
      }
    }

    const permissions = (calendar.$permissions || []) as string[]
    const userId = user.$id

    const userReadPermission = `read("user:${userId}")`
    const userWritePermission = `write("user:${userId}")`
    const userUpdatePermission = `update("user:${userId}")`
    const userDeletePermission = `delete("user:${userId}")`

    // Verificar permisos específicos
    const canRead =
      permissions.includes(userReadPermission) ||
      permissions.some((p: string) => p.includes(`read("user:${userId}")`))
    const canWrite =
      permissions.includes(userWritePermission) ||
      permissions.some((p: string) => p.includes(`write("user:${userId}")`))
    const canUpdate =
      permissions.includes(userUpdatePermission) ||
      permissions.some(
        (p: string) =>
          p.includes(`update("user:${userId}")`) ||
          p.includes(`write("user:${userId}")`),
      )
    const canDelete =
      permissions.includes(userDeletePermission) ||
      permissions.some(
        (p: string) =>
          p.includes(`delete("user:${userId}")`) ||
          p.includes(`write("user:${userId}")`),
      )

    return {
      canRead,
      canCreate: canWrite,
      canUpdate,
      canDelete,
    }
  } catch (error) {
    console.error("Error getting calendar permissions:", error)
    return {
      canRead: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    }
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
      Permission.write(Role.user(user.$id)),
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

      // Crear etiquetas por defecto para el nuevo calendario
      if (personalCalendar) {
        await createDefaultEtiquettes(personalCalendar.$id)
      }
    }

    return personalCalendar
  } catch (error) {
    console.error("Error getting or creating personal calendar:", error)
    return null
  }
}

/**
 * Obtiene el calendario nacional - es un calendario único y global
 */
export async function getNationalCalendar(): Promise<Calendars | null> {
  try {
    const data = await db()
    const result = await data.calendars.list([
      Query.equal("slug", "national-calendar"),
    ])
    return (result.documents[0] as Calendars) || null
  } catch (error) {
    console.error("Error getting national calendar:", error)
    return null
  }
}

/**
 * Obtiene un calendario por su slug de forma genérica
 */
export async function getCalendarBySlug(
  slug: string,
): Promise<Calendars | null> {
  try {
    const data = await db()
    const result = await data.calendars.list([Query.equal("slug", slug)])
    return (result.documents[0] as Calendars) || null
  } catch (error) {
    console.error(`Error getting calendar with slug ${slug}:`, error)
    return null
  }
}

/**
 * Obtiene el calendario único de sede
 */
export async function getSedeCalendar(): Promise<Calendars | null> {
  return await getCalendarBySlug("sede-calendar")
}

/**
 * Obtiene el calendario único de facultad
 */
export async function getFacultadCalendar(): Promise<Calendars | null> {
  return await getCalendarBySlug("facultad-calendar")
}

/**
 * Obtiene el calendario único de programa
 */
export async function getProgramaCalendar(): Promise<Calendars | null> {
  return await getCalendarBySlug("programa-calendar")
}

/**
 * Obtiene el calendario de sede específica (versión con slug)
 */
export async function getSedeCalendarBySlug(
  sedeSlug: string,
): Promise<Calendars | null> {
  return await getCalendarBySlug(`sede-${sedeSlug}`)
}

/**
 * Obtiene el calendario de facultad específica (versión con slug)
 */
export async function getFacultadCalendarBySlug(
  facultadSlug: string,
): Promise<Calendars | null> {
  return await getCalendarBySlug(`facultad-${facultadSlug}`)
}

/**
 * Obtiene el calendario de programa específico (versión con slug)
 */
export async function getProgramaCalendarBySlug(
  programaSlug: string,
): Promise<Calendars | null> {
  return await getCalendarBySlug(`programa-${programaSlug}`)
}

/**
 * Obtiene permisos dinámicos para calendarios específicos basado en teams
 * @param calendarId - ID del calendario
 * @param requiredRole - Rol requerido para editar (ej: "calendar-national", "calendar-sede")
 */
export async function getCalendarTeamPermissions(
  calendarId: string,
  requiredRole: string,
) {
  try {
    const user = await getUser()
    if (!user) {
      return {
        canRead: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
      }
    }

    const data = await db()
    const calendar = await data.calendars.get(calendarId)

    if (!calendar) {
      return {
        canRead: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
      }
    }

    // Todos los usuarios autenticados pueden leer
    const canRead = true

    const canEdit = await userHasRole(requiredRole)

    return {
      canRead,
      canCreate: canEdit,
      canUpdate: canEdit,
      canDelete: canEdit,
    }
  } catch (error) {
    console.error("Error getting calendar team permissions:", error)
    return {
      canRead: true, // Por defecto, todos pueden leer
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    }
  }
}
