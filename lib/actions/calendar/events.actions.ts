"use server"

import { ID, Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { handleError } from "@/lib/utils/error-handler"
import { setPermissions } from "@/lib/utils/permissions"
import { type CalendarEvents, type Calendars, type Profiles } from "@/types"

export async function getCalendarEvents(
  calendar: Calendars,
  profile?: Profiles,
): Promise<CalendarEvents[]> {
  try {
    const data = await db()
    const queries = []

    queries.push(Query.equal("calendar", calendar.$id))

    if (profile) {
      if (calendar.slug === "sede" && profile.sede) {
        queries.push(Query.equal("sede", profile.sede.$id))
      } else if (calendar.slug === "faculty" && profile.faculty) {
        queries.push(Query.equal("faculty", profile.faculty.$id))
      } else if (calendar.slug === "program" && profile.program) {
        queries.push(Query.equal("program", profile.program.$id))
      }
    }

    const result = await data.calendarEvents.list([
      ...queries,
      Query.select(["*", "etiquette.*"]),
    ])

    return result.rows as CalendarEvents[]
  } catch (error) {
    handleError(error)
  }
}

export async function createEvent(
  event: CalendarEvents,
): Promise<CalendarEvents> {
  try {
    const data = await db()
    const permissions = await setPermissions(event.calendar?.slug)
    const result = await data.calendarEvents.upsert(
      ID.unique(),
      event,
      permissions,
    )
    return result as CalendarEvents
  } catch (error) {
    handleError(error)
  }
}

export async function updateEvent(
  event: CalendarEvents,
): Promise<CalendarEvents> {
  try {
    const data = await db()
    const result = await data.calendarEvents.upsert(event.$id, event)
    return result as CalendarEvents
  } catch (error) {
    handleError(error)
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const data = await db()
    await data.calendarEvents.delete(eventId)
    return true
  } catch (error) {
    handleError(error)
  }
}
