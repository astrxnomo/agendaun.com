"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type ScheduleEvents, type Schedules } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getScheduleEvents(
  schedule: Schedules,
): Promise<ScheduleEvents[]> {
  const { database } = await createSessionClient()

  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_EVENTS,
      queries: [
        Query.equal("schedule", schedule.$id),
        Query.select(["*", "schedule.*", "schedule.category.*"]),
      ],
    })

    return result.rows as unknown as ScheduleEvents[]
  } catch (error) {
    console.error("Error fetching schedule events:", error)
    handleError(error)
  }
}
