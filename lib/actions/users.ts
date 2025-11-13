"use server"

import { createAdminClient } from "@/lib/appwrite"
import {
  ScheduleCategories,
  type CalendarEvents,
  type Calendars,
  type Schedules,
} from "@/lib/data/types"

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

export async function calendarEditMode(calendar: Calendars): Promise<boolean> {
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

export async function scheduleEditMode(schedule: Schedules): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

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

export async function canAdminCalendarEtiquettes(
  calendar: Calendars,
): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    if (calendar.profile?.user_id === user.$id) return true

    const roles = await getRoles()
    const res = checkPermissions(roles, [`c-${calendar.slug}.admin`])

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
      `c-${calendar.slug}.editor`,
    ])
  } catch (error) {
    handleError(error)
  }
}

export async function canEditCalendarEvent(
  event: CalendarEvents,
): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    const calendar = event.calendar as Calendars

    if (calendar.profile?.user_id === user.$id) return true

    const roles = await getRoles()

    // Si es admin del calendario, puede editar todos los eventos
    const isAdmin = await checkPermissions(roles, [`c-${calendar.slug}.admin`])
    if (isAdmin) return true

    // Si es editor, solo puede editar sus propios eventos
    const isEditor = await checkPermissions(roles, [
      `c-${calendar.slug}.editor`,
    ])

    if (isEditor && event.created_by) {
      const createdByUserId =
        typeof event.created_by === "object"
          ? event.created_by.user_id
          : undefined

      if (createdByUserId === user.$id) return true
    }

    return false
  } catch (error) {
    handleError(error)
    return false
  }
}

export async function canAdminSchedule(
  category?: ScheduleCategories,
  schedule?: Schedules,
): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    const roles = await getRoles()

    const permissions = ["s.admin"]

    if (category) {
      permissions.push(`s-${category.slug}.admin`)
    }

    if (schedule) {
      permissions.push(`s-${schedule.$id}.admin`)
    }

    return checkPermissions(roles, permissions)
  } catch (error) {
    handleError(error)
    return false
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
