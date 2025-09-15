"use server"

import { ID, Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { type Calendars, type Events, type Profiles } from "@/types"

import { handleError } from "../utils/error-handler"
import { setPermissions } from "../utils/permissions"

export async function getCalendarEvents(
  calendar: Calendars,
  profile?: Profiles,
): Promise<Events[]> {
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

    const result = await data.events.list([
      ...queries,
      Query.select(["*", "etiquette.*"]),
    ])

    return result.rows as Events[]
  } catch (error) {
    handleError(error)
  }
}

export async function createEvent(event: Events): Promise<Events> {
  try {
    const data = await db()
    const permissions = await setPermissions(event.calendar?.slug)
    const result = await data.events.upsert(ID.unique(), event, permissions)
    return result as Events
  } catch (error) {
    handleError(error)
  }
}

export async function updateEvent(event: Events): Promise<Events> {
  try {
    const data = await db()
    const result = await data.events.upsert(event.$id, event)
    return result as Events
  } catch (error) {
    handleError(error)
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const data = await db()
    await data.events.delete(eventId)
    return true
  } catch (error) {
    handleError(error)
  }
}
