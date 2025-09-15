"use server"

import { Query } from "node-appwrite"

import { db } from "../appwrite/db"
import { dbAdmin } from "../appwrite/db-admin"
import { handleError } from "../utils/error-handler"

import type { Profiles } from "@/types"

export async function updateProfile(profile: Profiles): Promise<Profiles> {
  try {
    const data = await dbAdmin()

    const result = await data.profiles.upsert(profile.$id, profile)
    return result as Profiles
  } catch (error) {
    console.error("Error updating user profile:", error)
    handleError(error)
  }
}

export async function getProfile(profileId: string): Promise<Profiles | null> {
  try {
    const data = await db()

    const result = await data.profiles.list([
      Query.equal("user_id", profileId),
      Query.select(["*", "sede.*", "faculty.*", "program.*"]),
    ])

    // Return null if no profile found, instead of undefined
    return (result.rows[0] as Profiles) || null
  } catch (error) {
    console.error("Error getting profile:", error)
    handleError(error)
  }
}
