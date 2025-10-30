"use server"

import { createAdminClient } from "@/lib/appwrite"
import { type Calendars, type Schedules } from "@/lib/data/types"

import { getUser } from "../data/users/getUser"
import { handleError } from "../utils/error-handler"

async function getUserEditorRoles(): Promise<string[]> {
  try {
    const user = await getUser()
    if (!user) return []

    const { users } = await createAdminClient()

    const memberships = await users.listMemberships({ userId: user.$id })

    const editorMembership = memberships.memberships.find(
      (membership) =>
        membership.teamId === process.env.NEXT_PUBLIC_TEAMS_EDITORS,
    )

    if (!editorMembership) return []

    return editorMembership.roles || []
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

    const roles = await getUserEditorRoles()
    return checkPermissions(roles, [`${calendar.slug}-calendar`])
  } catch (error) {
    handleError(error)
  }
}

export async function canEditSchedule(schedule: Schedules): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    const roles = await getUserEditorRoles()
    return checkPermissions(roles, [
      "schedules-admin",
      `${schedule.category.slug}-schedule`,
      `${schedule.$id}-schedule`,
    ])
  } catch (error) {
    handleError(error)
  }
}

export async function canEditScheduleCategory(
  categorySlug: string,
): Promise<boolean> {
  try {
    const roles = await getUserEditorRoles()
    return checkPermissions(roles, [
      "schedules-admin",
      `${categorySlug}-schedule`,
    ])
  } catch (error) {
    handleError(error)
  }
}

export async function getUserRoles(filterPattern?: string): Promise<string[]> {
  try {
    const roles = await getUserEditorRoles()

    if (!filterPattern) return roles

    return roles.filter((role) => {
      if (role === filterPattern) return true
      return role.includes(filterPattern)
    })
  } catch (error) {
    handleError(error)
  }
}
