"use server"

import { Query } from "node-appwrite"

import { createAdminClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Calendars, type Schedules } from "@/lib/data/types"

import { getUser } from "../data/users/getUser"
import { handleError } from "../utils/error-handler"

async function getRoles(): Promise<string[]> {
  try {
    const user = await getUser()
    if (!user) return []

    const { users } = await createAdminClient()

    const memberships = await users.listMemberships({ userId: user.$id })

    const editorMembership = memberships.memberships.find(
      (membership) =>
        membership.teamId === process.env.NEXT_PUBLIC_TEAMS_EDITORS,
    )

    return editorMembership?.roles || []
  } catch (error) {
    handleError(error)
  }
}

async function checkPermissions(
  roles: string[],
  checks: string[],
): Promise<boolean> {
  return checks.some((check) => roles.includes(check))
}

export async function canEditCalendar(calendar: Calendars): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    if (calendar.profile?.user_id === user.$id) return true

    const roles = await getRoles()
    return checkPermissions(roles, [
      `c-${calendar.slug}.admin`,
      `c-${calendar.slug}.editor`,
    ])
  } catch (error) {
    handleError(error)
  }
}

export async function canEditSchedule(schedule: Schedules): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    console.log(schedule)

    const roles = await getRoles()
    return checkPermissions(roles, [
      "s.admin",
      `s-${schedule.category.slug}.admin`,
      `s-${schedule.category.slug}.editor`,
      `s-${schedule.$id}.admin`,
      `s-${schedule.$id}.editor`,
    ])
  } catch (error) {
    handleError(error)
  }
}

export async function canEditScheduleCategory(
  categorySlug: string,
): Promise<boolean> {
  try {
    const roles = await getRoles()
    return checkPermissions(roles, ["s.admin", `s-${categorySlug}.admin`])
  } catch (error) {
    handleError(error)
  }
}

export async function getUserRoles(filterPattern?: string): Promise<string[]> {
  try {
    const roles = await getRoles()

    if (!filterPattern) return roles

    return roles.filter((role) => {
      if (role === filterPattern) return true
      return role.includes(filterPattern)
    })
  } catch (error) {
    handleError(error)
  }
}

export async function canAdminCalendarEtiquettes(
  calendar: Calendars,
): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    if (calendar.profile?.user_id === user.$id) return true

    const roles = await getRoles()
    console.log(roles)
    const res = checkPermissions(roles, [`c-${calendar.slug}.admin`])
    console.log(roles)
    return res
  } catch (error) {
    handleError(error)
  }
}

export async function canAdminCalendar(calendar: Calendars): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    if (calendar.profile?.user_id === user.$id) return true

    const roles = await getRoles()
    console.log(roles)
    const res = checkPermissions(roles, [
      `c-${calendar.slug}.admin`,
      `c-${calendar.slug}.editor`,
    ])
    console.log(roles)
    return res
  } catch (error) {
    handleError(error)
  }
}

export async function canCreateInCalendar(
  calendar: Calendars,
): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    if (calendar.profile?.user_id === user.$id) return true

    const roles = await getRoles()
    return checkPermissions(roles, [
      `c-${calendar.slug}.admin`,
      `c-${calendar.slug}.editor`, // Los editores pueden crear
    ])
  } catch (error) {
    handleError(error)
  }
}

export async function canEditInCalendar(calendar: Calendars): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    if (calendar.profile?.user_id === user.$id) return true

    const roles = await getRoles()
    return checkPermissions(roles, [
      `c-${calendar.slug}.admin`, // Solo los admins pueden editar
    ])
  } catch (error) {
    handleError(error)
  }
}

export async function canEditCalendarEvent(
  calendar: Calendars,
  eventCreatedBy?: string,
): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    // Si es dueño del calendario, puede editar todos los eventos
    if (calendar.profile?.user_id === user.$id) return true

    const roles = await getRoles()

    // Si es admin del calendario, puede editar todos los eventos
    const isAdmin = await checkPermissions(roles, [`c-${calendar.slug}.admin`])
    if (isAdmin) return true

    // Si es editor y creador del evento, puede editarlo
    const isEditor = await checkPermissions(roles, [
      `c-${calendar.slug}.editor`,
    ])

    console.log("canEditCalendarEvent - Debug info:", {
      isEditor,
      eventCreatedBy,
      userId: user.$id,
      calendarSlug: calendar.slug,
      roles,
    })

    if (isEditor && eventCreatedBy) {
      // Necesitamos obtener el perfil del usuario para comparar correctamente
      const { database } = await createAdminClient()
      try {
        // Obtener el perfil del usuario actual
        const userProfiles = await database.listRows({
          databaseId: DATABASE_ID,
          tableId: TABLES.PROFILES,
          queries: [Query.equal("user_id", user.$id)],
        })

        if (userProfiles.rows.length > 0) {
          const userProfileId = userProfiles.rows[0].$id
          console.log("Profile comparison:", {
            userProfileId,
            eventCreatedBy,
            match: userProfileId === eventCreatedBy,
          })
          if (userProfileId === eventCreatedBy) return true
        }
      } catch (error) {
        console.error("Error getting user profile:", error)
      }
    }

    return false
  } catch (error) {
    handleError(error)
    return false
  }
}

export async function canAdminSchedule(schedule: Schedules): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    console.log(schedule)

    const roles = await getRoles()
    return checkPermissions(roles, [
      "s.admin",
      `s-${schedule.category.slug}.admin`,
      `s-${schedule.$id}.admin`,
    ])
  } catch (error) {
    handleError(error)
  }
}

export async function canAdminScheduleCategory(
  categorySlug: string,
): Promise<boolean> {
  try {
    const roles = await getRoles()
    return checkPermissions(roles, ["s.admin", `s-${categorySlug}.admin`])
  } catch (error) {
    handleError(error)
  }
}
