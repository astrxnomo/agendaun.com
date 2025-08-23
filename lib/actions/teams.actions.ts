"use server"

import { getUser } from "@/lib/appwrite/auth"
import { createAdminClient } from "@/lib/appwrite/config"

export async function getEditorRoles() {
  try {
    const user = await getUser()
    if (!user) return false

    const { users } = await createAdminClient()

    const memberships = await users.listMemberships(user.$id)

    const editorMembership = memberships.memberships.find(
      (membership) =>
        membership.teamId === process.env.NEXT_PUBLIC_TEAMS_EDITORS,
    )

    return editorMembership?.roles
  } catch (error) {
    console.error("Error checking user role:", error)
    return false
  }
}

export async function userCanEdit(calendarSlug: string) {
  const roles = await getEditorRoles()
  if (!roles) return false
  if (roles.includes(calendarSlug)) return true
  return false
}
