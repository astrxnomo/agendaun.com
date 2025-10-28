"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type ScheduleCategories } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getAllScheduleCategories(): Promise<
  ScheduleCategories[]
> {
  const { database } = await createSessionClient()

  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_CATEGORIES,
      queries: [Query.orderAsc("name")],
    })

    return result.rows as unknown as ScheduleCategories[]
  } catch (error) {
    console.error("Error fetching schedule categories:", error)
    handleError(error)
  }
}
