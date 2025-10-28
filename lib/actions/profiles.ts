"use server"

import { createAdminClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Profiles } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function update(profile: Profiles): Promise<Profiles> {
  try {
    const { database } = await createAdminClient()

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.PROFILES,
      rowId: profile.$id,
      data: profile,
    })

    return result as unknown as Profiles
  } catch (error) {
    console.error("Error updating user profile:", error)
    handleError(error)
  }
}
