"use server"

import { Query } from "node-appwrite"

import { dbAdmin } from "@/lib/appwrite/db-admin"
import { handleError } from "@/lib/utils/error-handler"

import type { Colors, ScheduleEvents } from "@/types"

/**
 * Get all events for a specific schedule
 */
export async function getScheduleEvents(
  scheduleId: string,
): Promise<ScheduleEvents[]> {
  try {
    const data = await dbAdmin()
    const result = await data.scheduleEvents.list([
      Query.equal("schedule", scheduleId),
      Query.select(["*", "schedule.*"]),
      Query.orderAsc("start_time"),
    ])

    return result.rows as ScheduleEvents[]
  } catch (error) {
    console.error("Error fetching schedule events:", error)
    handleError(error)
  }
}

/**
 * Create a new schedule event
 */
export async function createScheduleEvent(data: {
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  schedule: string
  color: Colors
}): Promise<ScheduleEvents | null> {
  try {
    const db = await dbAdmin()
    const result = await db.scheduleEvents.create(data)

    return result as ScheduleEvents
  } catch (error) {
    console.error("Error creating schedule event:", error)
    handleError(error)
  }
}

/**
 * Update a schedule event
 */
export async function updateScheduleEvent(
  eventId: string,
  data: Partial<{
    title: string
    description: string
    start_time: string
    end_time: string
    location: string
    color: Colors
  }>,
): Promise<ScheduleEvents | null> {
  try {
    const db = await dbAdmin()
    const result = await db.scheduleEvents.update(eventId, data)

    return result as ScheduleEvents
  } catch (error) {
    console.error("Error updating schedule event:", error)
    handleError(error)
  }
}

/**
 * Delete a schedule event
 */
export async function deleteScheduleEvent(eventId: string): Promise<boolean> {
  try {
    const db = await dbAdmin()
    await db.scheduleEvents.delete(eventId)

    return true
  } catch (error) {
    console.error("Error deleting schedule event:", error)
    handleError(error)
  }
}
