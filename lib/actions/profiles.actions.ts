"use server"

import { Query } from "node-appwrite"

import { getUser } from "../appwrite/auth"
import { db } from "../appwrite/db"

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
}) {
  try {
    const data = await db()

    const existingProfile = await data.profiles.list([
      Query.equal("user_id", user_id),
    ])

    if (existingProfile.documents.length > 0) {
      const profileId = existingProfile.documents[0].$id
      const result = await data.profiles.update(profileId, {
        sede_id: sede_id,
        faculty_id: faculty_id,
        program_id: program_id,
      })
      return { success: true, profile: result as Profiles }
    } else {
      return { success: false, error: "Profile not found" }
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error }
  }
}

export async function getUserProfile() {
  try {
    const user = await getUser()
    if (!user) return null
    const data = await db()

    const profile = await data.profiles.list([Query.equal("user_id", user.$id)])

    return profile.documents[0] as Profiles
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}
