"use server"

import { ID } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type ScheduleEvents } from "@/lib/appwrite/types"
import { handleError } from "@/lib/utils/error-handler"

export async function createEvent(
  event: ScheduleEvents,
): Promise<ScheduleEvents> {
  try {
    const { database } = await createSessionClient()

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_EVENTS,
      rowId: ID.unique(),
      data: event,
    })

    return result as unknown as ScheduleEvents
  } catch (error) {
    console.error("Error creating schedule event:", error)
    handleError(error)
  }
}

export async function updateEvent(
  event: ScheduleEvents,
): Promise<ScheduleEvents> {
  try {
    const { database } = await createSessionClient()

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_EVENTS,
      rowId: event.$id,
      data: event,
    })

    return result as unknown as ScheduleEvents
  } catch (error) {
    console.error("Error updating schedule event:", error)
    handleError(error)
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const { database } = await createSessionClient()

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_EVENTS,
      rowId: eventId,
    })

    return true
  } catch (error) {
    console.error("Error deleting schedule event:", error)
    handleError(error)
  }
}
