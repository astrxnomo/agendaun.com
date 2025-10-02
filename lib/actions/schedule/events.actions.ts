"use server"

import { ID, Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { handleError } from "@/lib/utils/error-handler"

import type { ScheduleEvents, Schedules } from "@/types"

export async function getScheduleEvents(
  schedule: Schedules,
): Promise<ScheduleEvents[]> {
  try {
    const data = await db()

    const result = await data.scheduleEvents.list([
      Query.equal("schedule", schedule.$id),
      Query.select(["*", "schedule.*"]),
      Query.orderAsc("start_time"),
    ])

    return result.rows as ScheduleEvents[]
  } catch (error) {
    console.error("Error fetching schedule events:", error)
    handleError(error)
  }
}

export async function createScheduleEvent(
  event: ScheduleEvents,
): Promise<ScheduleEvents> {
  try {
    const data = await db()

    const result = await data.scheduleEvents.upsert(ID.unique(), event)

    return result as ScheduleEvents
  } catch (error) {
    console.error("Error creating schedule event:", error)
    handleError(error)
  }
}

export async function updateScheduleEvent(
  event: ScheduleEvents,
): Promise<ScheduleEvents> {
  try {
    const data = await db()

    const result = await data.scheduleEvents.upsert(event.$id, event)

    return result as ScheduleEvents
  } catch (error) {
    console.error("Error updating schedule event:", error)
    handleError(error)
  }
}

export async function deleteScheduleEvent(eventId: string): Promise<boolean> {
  try {
    const data = await db()

    await data.scheduleEvents.delete(eventId)

    return true
  } catch (error) {
    console.error("Error deleting schedule event:", error)
    handleError(error)
  }
}
