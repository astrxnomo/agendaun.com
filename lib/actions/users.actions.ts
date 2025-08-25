"use server"

import { getUser } from "@/lib/appwrite/auth"
import { createAdminClient } from "@/lib/appwrite/config"
import { type Calendars } from "@/types"

export async function userCanEdit(calendar: Calendars) {
  try {
    const user = await getUser()
    if (!user) return false

    if (calendar.owner_id === user.$id) return true

    if (user.labels.includes("admin")) return true

    const { users } = await createAdminClient()

    const memberships = await users.listMemberships(user.$id)

    const editorMembership = memberships.memberships.find(
      (membership) =>
        membership.teamId === process.env.NEXT_PUBLIC_TEAMS_EDITORS,
    )

    if (!editorMembership) return false

    const editorRoles = editorMembership.roles
    if (!editorRoles) return false
    if (editorRoles.includes("admin")) return true
    if (editorRoles.includes(calendar.slug)) return true

    return false
  } catch (error) {
    console.error("Error checking user role:", error)
    return false
  }
}
