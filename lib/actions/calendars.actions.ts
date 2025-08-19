"use server"

import { Permission, Query, Role } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { createSessionClient } from "@/lib/appwrite/config"
import { db } from "@/lib/appwrite/db"
import { CalendarViews, Colors, type Calendars } from "@/types"

import { createEtiquette } from "./etiquettes.actions"

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
 * Crea el calendario nacional con permisos específicos para teams
 */
export async function createNationalCalendar(): Promise<Calendars | null> {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not authenticated")

    const data = await db()

    // Permisos para el calendario nacional:
    // - Todos los usuarios pueden leer
    // - Admins tienen acceso completo
    // - Editores con rol "national-calendar" pueden escribir y actualizar
    const permissions = [
      Permission.read(Role.any()), // Todos pueden leer
      Permission.write(Role.team("admins")),
      Permission.write(Role.team("editors", "national-calendar")),
      Permission.update(Role.team("admins")),
      Permission.update(Role.team("editors", "national-calendar")),
      Permission.delete(Role.team("admins")),
    ]

    const calendarData = {
      name: "Calendario Nacional",
      defaultView: CalendarViews.MONTH,
      slug: "national-calendar",
      owner_id: user.$id, // El creador inicial
    }

    const result = await data.calendars.create(calendarData, permissions)
    return result as Calendars
  } catch (error) {
    console.error("Error creating national calendar:", error)
    return null
  }
}

/**
 * Obtiene o crea el calendario nacional
 */
export async function getOrCreateNationalCalendar(): Promise<Calendars | null> {
  try {
    let nationalCalendar = await getNationalCalendar()

    if (!nationalCalendar) {
      nationalCalendar = await createNationalCalendar()

      // Crear etiquetas por defecto para el calendario nacional
      if (nationalCalendar) {
        await createNationalCalendarEtiquettes(nationalCalendar.$id)
      }
    }

    return nationalCalendar
  } catch (error) {
    console.error("Error getting or creating national calendar:", error)
    return null
  }
}

/**
 * Crea etiquetas por defecto para el calendario nacional
 */
async function createNationalCalendarEtiquettes(calendarId: string) {
  const nationalEtiquettes = [
    { name: "Festividad Nacional", color: Colors.RED },
    { name: "Día Festivo", color: Colors.BLUE },
    { name: "Fecha Conmemorativa", color: Colors.GREEN },
    { name: "Evento Especial", color: Colors.YELLOW },
  ]

  for (const etiquette of nationalEtiquettes) {
    try {
      await createEtiquette({
        name: etiquette.name,
        color: etiquette.color,
        isActive: true,
        calendar_id: calendarId,
      })
    } catch (error) {
      console.error(`Error creating etiquette ${etiquette.name}:`, error)
    }
  }
}

/**
 * Obtiene permisos específicos para el calendario nacional basado en teams
 */
export async function getNationalCalendarPermissions(calendarId: string) {
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

    // Para el calendario nacional, todos pueden leer
    const canRead = true

    // Verificar si el usuario pertenece a teams específicos usando la API real
    const { getUserRolesInTeamByName } = await import("./teams.actions")

    // Buscar team de admins
    const adminRoles = await getUserRolesInTeamByName("Administradores")
    const isAdmin = adminRoles.includes("admin")

    // Buscar team de editores con permisos para calendario nacional
    const editorRoles = await getUserRolesInTeamByName("Editores")
    const canEditNational = editorRoles.includes("national-calendar")

    return {
      canRead,
      canCreate: isAdmin || canEditNational,
      canUpdate: isAdmin || canEditNational,
      canDelete: isAdmin,
    }
  } catch (error) {
    console.error("Error getting national calendar permissions:", error)
    return {
      canRead: true, // Por defecto, todos pueden leer el calendario nacional
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    }
  }
}

/**
 * Función temporal para gestionar roles de usuario
 * En producción, esto debería estar en un sistema de gestión de teams más robusto
 */
export async function getUserTeams(_userId: string): Promise<string[]> {
  try {
    // Por ahora, usaremos las preferencias del usuario para almacenar los teams
    // En producción, esto debería consultar una colección de teams o usar Appwrite Teams
    const user = await getUser()
    if (!user) return []

    return (user.prefs?.teams as string[]) || []
  } catch (error) {
    console.error("Error getting user teams:", error)
    return []
  }
}

/**
 * Función para asignar un usuario a un team (solo para desarrollo/pruebas)
 * En producción, esto se haría a través de Appwrite Teams API
 */
export async function addUserToTeam(
  userId: string,
  teamName: string,
): Promise<boolean> {
  try {
    const { account } = await createSessionClient()
    const user = await account.get()

    if (user.$id !== userId) {
      throw new Error("No tienes permisos para modificar este usuario")
    }

    const currentTeams = user.prefs?.teams || []
    if (!currentTeams.includes(teamName)) {
      const updatedTeams = [...currentTeams, teamName]
      await account.updatePrefs({ ...user.prefs, teams: updatedTeams })
    }

    return true
  } catch (error) {
    console.error("Error adding user to team:", error)
    return false
  }
}

/**
 * Función para verificar si un usuario pertenece a un team específico
 */
export async function isUserInTeam(
  userId: string,
  teamName: string,
): Promise<boolean> {
  try {
    const userTeams = await getUserTeams(userId)
    return userTeams.includes(teamName)
  } catch (error) {
    console.error("Error checking user team membership:", error)
    return false
  }
}
