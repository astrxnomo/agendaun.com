"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Schedules } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getScheduleById(
  scheduleId: string,
): Promise<Schedules | null> {
  const { database } = await createSessionClient()

  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULES,
      queries: [
        Query.equal("$id", scheduleId),
        Query.select(["*", "sede.*", "category.*"]),
        Query.limit(1),
      ],
    })

    return (result.rows[0] as unknown as Schedules) || null
  } catch (error) {
    console.error(`Error getting schedule with id ${scheduleId}:`, error)
    handleError(error)
  }
}
