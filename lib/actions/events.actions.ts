"use server"

import { ID, Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { type Calendars, type Events, type User } from "@/types"

import {
  handleAppwriteError,
  isAppwriteError,
  type AppwriteError,
} from "../utils/error-handler"
import { setPermissions } from "../utils/permissions"
import { getProfile } from "./profiles.actions"

export async function getCalendarEvents(
  calendar: Calendars,
  user: User,
): Promise<Events[] | AppwriteError> {
  try {
    const data = await db()

    const queries = []
    const profile = await getProfile(user.$id)

    if (isAppwriteError(profile)) {
      console.error("Error fetching profile for calendar events:", profile.type)
      return handleAppwriteError(profile)
    }

    if (!profile) {
      return []
    }

    queries.push(Query.equal("calendar", calendar.$id))

    if (calendar.slug === "sede-calendar") {
      if (!profile.sede?.$id) {
        console.warn("Profile sede is missing for sede-calendar")
        return []
      }
      queries.push(Query.equal("sede", profile.sede.$id))
    } else if (calendar.slug === "faculty-calendar") {
      if (!profile.faculty?.$id) {
        console.warn("Profile faculty is missing for faculty-calendar")
        return []
      }
      queries.push(Query.equal("faculty", profile.faculty.$id))
    } else if (calendar.slug === "program-calendar") {
      if (!profile.program?.$id) {
        console.warn("Profile program is missing for program-calendar")
        return []
      }
      queries.push(Query.equal("program", profile.program.$id))
    }

    const result = await data.events.list([
      ...queries,
      Query.select(["*", "etiquette.*"]),
    ])

    return result.rows as Events[]
  } catch (error) {
    console.error("Error getting calendar events:", error)
    return handleAppwriteError(error)
  }
}

export async function createEvent(
  event: Events,
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
  event: Events,
): Promise<Events | AppwriteError> {
  try {
    const data = await db()

    const result = await data.events.upsert(event.$id, event)
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
    const result = await data.events.delete(eventId)

    return result as boolean
  } catch (error) {
    console.error("Error deleting event:", error)
    return handleAppwriteError(error)
  }
}
