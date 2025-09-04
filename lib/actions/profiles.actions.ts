"use server"

import { Query } from "node-appwrite"

import { getUser } from "../appwrite/auth"
import { db } from "../appwrite/db"
import { dbAdmin } from "../appwrite/db-admin"
import { handleAppwriteError, type AppwriteError } from "../utils/error-handler"

import type { Profiles } from "@/types"

export async function updateUserProfile({
  user_id,
  sede_id,
  faculty_id,
  program_id,
}: {
  user_id: string
  sede_id?: string | null
  faculty_id?: string | null
  program_id?: string | null
}): Promise<Profiles | AppwriteError> {
  try {
    const data = await dbAdmin()

    const existingProfile = await data.profiles.list([
      Query.equal("user_id", user_id),
    ])

    if (existingProfile.rows.length > 0) {
      const profileId = existingProfile.rows[0].$id
      const result = await data.profiles.upsert(profileId, {
        user_id,
        sede: sede_id,
        faculty: faculty_id,
        program: program_id,
      })
      return result as Profiles
    } else {
      return handleAppwriteError(new Error("Profile not found"))
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return handleAppwriteError(error)
  }
}

export async function getUserProfile(): Promise<
  Profiles | AppwriteError | null
> {
  try {
    const user = await getUser()
    if (!user) return null
    const data = await db()

    const profile = await data.profiles.list([
      Query.equal("user_id", user.$id),
      Query.select(["*", "sede.*", "faculty.*", "program.*"]),
    ])

    return profile.rows[0] as Profiles
  } catch (error) {
    console.error("Error getting user profile:", error)
    return handleAppwriteError(error)
  }
}

// Optimized version for contexts that only need basic info
export async function getUserProfileLight(): Promise<
  Profiles | AppwriteError | null
> {
  try {
    const user = await getUser()
    if (!user) return null
    const data = await db()

    const profile = await data.profiles.list([
      Query.equal("user_id", user.$id),
      Query.select(["*", "sede.name", "faculty.name", "program.name"]),
    ])

    return profile.rows[0] as Profiles
  } catch (error) {
    console.error("Error getting user profile (light):", error)
    return handleAppwriteError(error)
  }
}
