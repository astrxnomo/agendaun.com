"use server"

import { ID, Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { type Calendars, type Events } from "@/types"

import {
  handleAppwriteError,
  isAppwriteError,
  type AppwriteError,
} from "../utils/error-handler"
import { setPermissions } from "../utils/permissions"
import { getUserProfile } from "./profiles.actions"

export async function getCalendarEvents(
  calendar: Calendars,
): Promise<Events[] | AppwriteError> {
  try {
    const data = await db()
    const queries = []

    if (!calendar?.$id) {
      return []
    }

    const profileResult = await getUserProfile()
    if (isAppwriteError(profileResult)) {
      return profileResult
    }
    const profile = profileResult

    queries.push(Query.equal("calendar", calendar.$id))

    if (calendar.slug === "national-calendar") {
    } else if (calendar.slug === "sede-calendar") {
      if (!profile?.sede) {
        return []
      }
      queries.push(Query.equal("sede", profile.sede.$id))
    } else if (calendar.slug === "faculty-calendar") {
      if (!profile?.faculty) {
        return []
      }
      queries.push(Query.equal("faculty", profile.faculty.$id))
    } else if (calendar.slug === "program-calendar") {
      if (!profile?.program) {
        return []
      }
      queries.push(Query.equal("program", profile.program.$id))
    } else {
      if (!profile?.user_id) {
        return []
      }
    }

    const result = await data.events.list([
      ...queries,
      Query.select(["*", "etiquette.name", "etiquette.color"]),
    ])

    return result.rows as Events[]
  } catch (error) {
    console.error("Error getting calendar events:", error)
    return handleAppwriteError(error)
  }
}

export async function createEvent(
  event: Partial<Events>,
): Promise<Events | AppwriteError> {
  try {
    const data = await db()

    const permissions = await setPermissions(event.calendar?.slug)

    const result = await data.events.upsert(ID.unique(), event, permissions)
    return result as Events
  } catch (error) {
    console.error("Error creating event:", error)
    return handleAppwriteError(error)
  }
}

export async function updateEvent(
  eventId: string,
  event: Partial<Events>,
): Promise<Events | AppwriteError> {
  try {
    const data = await db()

    const result = await data.events.upsert(eventId, event)
    return result as Events
  } catch (error) {
    console.error("Error updating event:", error)
    return handleAppwriteError(error)
  }
}

export async function deleteEvent(
  eventId: string,
): Promise<boolean | AppwriteError> {
  try {
    const data = await db()
    await data.events.delete(eventId)
    return true
  } catch (error) {
    console.error("Error deleting event:", error)
    return handleAppwriteError(error)
  }
}
