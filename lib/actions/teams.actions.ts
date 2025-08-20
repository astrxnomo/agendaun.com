"use server"

import { Query } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { createSessionClient } from "@/lib/appwrite/config"

// Tipos para Teams
interface Membership {
  $id: string
  userId: string
  teamId: string
  roles: string[]
  invited: string
  joined: string
  confirm: boolean
  mfa: boolean
  $createdAt: string
  $updatedAt: string
}

/**
 * Verifica si el usuario actual tiene un rol específico en el team "editors"
 */
export async function userHasRole(role: string): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    const { teams } = await createSessionClient()

    const editorsTeamId = "68a4eb0c003d6a2551b4"

    const memberships = await teams.listMemberships(editorsTeamId, [
      Query.equal("userId", user.$id),
    ])

    if (memberships.memberships.length === 0) return false

    const userMembership = memberships.memberships[0] as Membership

    return userMembership.roles.includes(role)
  } catch (error) {
    console.error("Error checking user role:", error)
    return false
  }
}

async function getUserRoles(): Promise<string[]> {
  try {
    const user = await getUser()
    if (!user) return []

    const { teams } = await createSessionClient()

    const editorsTeamId = "68a4eb0c003d6a2551b4"

    const memberships = await teams.listMemberships(editorsTeamId, [
      Query.equal("userId", user.$id),
    ])

    if (memberships.memberships.length === 0) return []

    const userMembership = memberships.memberships[0] as Membership

    return userMembership.roles || []
  } catch (error) {
    console.error("Error getting user roles:", error)
    return []
  }
}
