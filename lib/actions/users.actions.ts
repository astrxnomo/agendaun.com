"use server"

import { getUser } from "@/lib/appwrite/auth"
import { createAdminClient, createSessionClient } from "@/lib/appwrite/config"
import { type Calendars, type Schedules, type User } from "@/types"

import { handleError } from "../utils/error-handler"

export async function updateUserName(name: string): Promise<User> {
  try {
    if (!name.trim()) {
      throw new Error("El nombre es requerido")
    }

    const { account } = await createSessionClient()

    const result = await account.updateName({
      name: name.trim(),
    })

    return result as User
  } catch (error) {
    console.error("Error updating user name:", error)
    handleError(error)
  }
}

export async function canEditCalendar(calendar: Calendars): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    if (calendar.profile?.user_id === user.$id) return true

    const { users } = await createAdminClient()

    const memberships = await users.listMemberships({ userId: user.$id })

    const editorMembership = memberships.memberships.find(
      (membership) =>
        membership.teamId === process.env.NEXT_PUBLIC_TEAMS_EDITORS,
    )

    if (!editorMembership) return false

    const editorRoles = editorMembership.roles

    if (!editorRoles) return false

    if (editorRoles.includes(`${calendar.slug}-calendar`)) return true

    return false
  } catch (error) {
    handleError(error)
  }
}

export async function canEditSchedule(schedule: Schedules): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    const { users } = await createAdminClient()

    const memberships = await users.listMemberships({ userId: user.$id })

    const editorMembership = memberships.memberships.find(
      (membership) =>
        membership.teamId === process.env.NEXT_PUBLIC_TEAMS_EDITORS,
    )

    if (!editorMembership) return false

    const editorRoles = editorMembership.roles

    if (!editorRoles) return false

    if (editorRoles.includes(`${schedule.category.slug}-schedule`)) return true

    return false
  } catch (error) {
    handleError(error)
    return false
  }
}
