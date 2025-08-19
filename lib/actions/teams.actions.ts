"use server"

import { ID } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { createAdminClient, createSessionClient } from "@/lib/appwrite/config"

// Tipos para Teams
interface Team {
  $id: string
  name: string
  total: number
  prefs: Record<string, any>
  $createdAt: string
  $updatedAt: string
}

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
 * Crea un team en Appwrite
 */
export async function createTeam(name: string, roles: string[] = []) {
  try {
    const { teams } = await createAdminClient()

    const result = await teams.create(ID.unique(), name, roles)

    return result
  } catch (error) {
    console.error("Error creating team:", error)
    throw error
  }
}

/**
 * Obtiene un team por su ID
 */
export async function getTeam(teamId: string) {
  try {
    const { teams } = await createSessionClient()
    const result = await teams.get(teamId)
    return result
  } catch (error) {
    console.error("Error getting team:", error)
    return null
  }
}

/**
 * Lista todos los teams del usuario actual
 */
export async function getUserTeams(): Promise<Team[]> {
  try {
    const { teams } = await createSessionClient()
    const result = await teams.list()
    return (result.teams as Team[]) || []
  } catch (error) {
    console.error("Error getting user teams:", error)
    return []
  }
}

/**
 * Obtiene las membresías de un team específico
 */
export async function getTeamMemberships(
  teamId: string,
): Promise<Membership[]> {
  try {
    const { teams } = await createSessionClient()
    const result = await teams.listMemberships(teamId)
    return (result.memberships as Membership[]) || []
  } catch (error) {
    console.error("Error getting team memberships:", error)
    return []
  }
}

/**
 * Crea una membresía en un team (invita a un usuario)
 */
export async function createTeamMembership(
  teamId: string,
  email: string,
  roles: string[],
  name?: string,
) {
  try {
    const { teams } = await createAdminClient()

    const result = await teams.createMembership(
      teamId,
      roles,
      email,
      undefined, // userId - se determinará por email
      undefined, // phone
      undefined, // url - no needed for server-side
      name,
    )

    return result
  } catch (error) {
    console.error("Error creating team membership:", error)
    throw error
  }
}

/**
 * Actualiza los roles de una membresía
 */
export async function updateMembershipRoles(
  teamId: string,
  membershipId: string,
  roles: string[],
) {
  try {
    const { teams } = await createAdminClient()

    const result = await teams.updateMembership(teamId, membershipId, roles)

    return result
  } catch (error) {
    console.error("Error updating membership roles:", error)
    throw error
  }
}

/**
 * Elimina una membresía de un team
 */
export async function deleteTeamMembership(
  teamId: string,
  membershipId: string,
) {
  try {
    const { teams } = await createAdminClient()
    await teams.deleteMembership(teamId, membershipId)
    return true
  } catch (error) {
    console.error("Error deleting team membership:", error)
    return false
  }
}

/**
 * Verifica si el usuario actual pertenece a un team específico
 */
export async function isUserInTeam(teamId: string): Promise<boolean> {
  try {
    const user = await getUser()
    if (!user) return false

    const userTeams = await getUserTeams()
    return userTeams.some((team: Team) => team.$id === teamId)
  } catch (error) {
    console.error("Error checking team membership:", error)
    return false
  }
}

/**
 * Obtiene un team por su nombre
 */
export async function getTeamByName(teamName: string): Promise<Team | null> {
  try {
    const { teams } = await createAdminClient()
    const teamsList = await teams.list()

    const team = (teamsList.teams as Team[]).find(
      (t: Team) => t.name === teamName,
    )

    return team || null
  } catch (error) {
    console.error("Error getting team by name:", error)
    return null
  }
}

/**
 * Obtiene los roles del usuario actual en un team específico (por ID)
 */
export async function getUserRolesInTeam(teamId: string): Promise<string[]> {
  try {
    const user = await getUser()
    if (!user) return []

    const memberships = await getTeamMemberships(teamId)
    const userMembership = memberships.find(
      (membership: Membership) => membership.userId === user.$id,
    )

    return userMembership?.roles || []
  } catch (error) {
    console.error("Error getting user roles in team:", error)
    return []
  }
}

/**
 * Obtiene los roles del usuario actual en un team específico (por nombre)
 */
export async function getUserRolesInTeamByName(
  teamName: string,
): Promise<string[]> {
  try {
    const team = await getTeamByName(teamName)
    if (!team) return []

    return await getUserRolesInTeam(team.$id)
  } catch (error) {
    console.error("Error getting user roles in team by name:", error)
    return []
  }
}

/**
 * Verifica si el usuario tiene un rol específico en un team
 */
export async function userHasRoleInTeam(
  teamId: string,
  role: string,
): Promise<boolean> {
  try {
    const userRoles = await getUserRolesInTeam(teamId)
    return userRoles.includes(role)
  } catch (error) {
    console.error("Error checking user role in team:", error)
    return false
  }
}

/**
 * Inicializa los teams básicos del sistema (solo ejecutar una vez)
 */
export async function initializeSystemTeams() {
  try {
    const { teams } = await createAdminClient()

    // Verificar si ya existen los teams
    const existingTeams = await teams.list()
    const teamNames = (existingTeams.teams as Team[]).map(
      (team: Team) => team.name,
    )

    const teamsToCreate = [
      {
        name: "Administradores",
        roles: ["admin"],
      },
      {
        name: "Editores",
        roles: [
          "editor",
          "national-calendar",
          "sede-calendar",
          "facultad-calendar",
          "programa-calendar",
        ],
      },
    ]

    const createdTeams = []

    for (const teamData of teamsToCreate) {
      if (!teamNames.includes(teamData.name)) {
        const newTeam = await createTeam(teamData.name, teamData.roles)
        createdTeams.push(newTeam)
        console.log(`Team created: ${teamData.name}`)
      } else {
        console.log(`Team already exists: ${teamData.name}`)
      }
    }

    return {
      success: true,
      message: "System teams initialized successfully",
      createdTeams,
    }
  } catch (error) {
    console.error("Error initializing system teams:", error)
    return {
      success: false,
      message: "Error initializing system teams",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
