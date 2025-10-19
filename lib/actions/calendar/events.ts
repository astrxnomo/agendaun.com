"use server"

import { ID } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type CalendarEvents } from "@/lib/appwrite/types"
import { handleError } from "@/lib/utils/error-handler"
import { setPermissions } from "@/lib/utils/permissions"

export async function createEvent(
  event: CalendarEvents,
): Promise<CalendarEvents> {
  try {
    const { database } = await createSessionClient()
    const permissions = await setPermissions(event.calendar?.slug)

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDAR_EVENTS,
      rowId: ID.unique(),
      data: event,
      permissions,
    })

    return result as unknown as CalendarEvents
  } catch (error) {
    handleError(error)
  }
}

export async function updateEvent(
  event: CalendarEvents,
): Promise<CalendarEvents> {
  try {
    const { database } = await createSessionClient()

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDAR_EVENTS,
      rowId: event.$id,
      data: event,
    })

    return result as unknown as CalendarEvents
  } catch (error) {
    handleError(error)
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const { database } = await createSessionClient()

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDAR_EVENTS,
      rowId: eventId,
    })

    return true
  } catch (error) {
    handleError(error)
  }
}
