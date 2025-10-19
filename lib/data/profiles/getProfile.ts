"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Profiles } from "@/lib/appwrite/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getProfile(profileId: string): Promise<Profiles | null> {
  const { database } = await createSessionClient()

  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.PROFILES,
      queries: [
        Query.equal("user_id", profileId),
        Query.select(["*", "sede.*", "faculty.*", "program.*"]),
      ],
    })

    // Return null if no profile found, instead of undefined
    return (result.rows[0] as unknown as Profiles) || null
  } catch (error) {
    console.error("Error getting profile:", error)
    handleError(error)
  }
}
