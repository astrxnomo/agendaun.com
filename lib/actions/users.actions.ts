"use server"

import { type Models } from "appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { createAdminClient, createSessionClient } from "@/lib/appwrite/config"
import { type Calendars, type User } from "@/types"

import { handleAppwriteError, type AppwriteError } from "../utils/error-handler"

export async function updateUserName(
  name: string,
): Promise<Models.User<Models.Preferences> | AppwriteError> {
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
    return handleAppwriteError(error)
  }
}

export async function userCanEdit(
  calendar: Calendars,
): Promise<boolean | AppwriteError> {
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

    if (editorRoles.includes(calendar.slug)) return true

    return false
  } catch (error) {
    console.error("Error checking user role:", error)
    return handleAppwriteError(error)
  }
}
