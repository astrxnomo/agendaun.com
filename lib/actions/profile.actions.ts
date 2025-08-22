"use server"

import { Query } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { createAdminClient } from "@/lib/appwrite/config"

import type { Profiles } from "@/types"

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!
const PROFILES_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_PROFILES!

export async function updateUserProfile(data: {
  user_id: string
  sede_id?: string | null
  faculty_id?: string | null
  program_id?: string | null
}) {
  try {
    const { database } = await createAdminClient()

    // Check if profile exists for this user
    const existingProfile = await database.listDocuments(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      [Query.equal("user_id", data.user_id)],
    )

    if (existingProfile.documents.length > 0) {
      // Update existing profile
      const profileId = existingProfile.documents[0].$id
      const result = await database.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        profileId,
        {
          sede_id: data.sede_id,
          faculty_id: data.faculty_id,
          program_id: data.program_id,
        },
      )
      return { success: true, profile: result }
    } else {
      // Create new profile
      const result = await database.createDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        "unique()",
        {
          user_id: data.user_id,
          sede_id: data.sede_id,
          faculty_id: data.faculty_id,
          program_id: data.program_id,
        },
      )
      return { success: true, profile: result }
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error }
  }
}

export async function getUserProfile(user_id: string) {
  try {
    const { database } = await createAdminClient()

    const profile = await database.listDocuments(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      [Query.equal("user_id", user_id)],
    )

    return profile.documents[0] as Profiles
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

/**
 * Obtiene el perfil del usuario actual autenticado
 */
export async function getCurrentUserProfile(): Promise<Profiles | null> {
  try {
    const user = await getUser()
    if (!user) return null

    const { database } = await createAdminClient()

    const profile = await database.listDocuments(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      [Query.equal("user_id", user.$id)],
    )

    if (profile.documents.length > 0) {
      return profile.documents[0] as Profiles
    }

    return null
  } catch (error) {
    console.error("Error getting current user profile:", error)
    return null
  }
}
