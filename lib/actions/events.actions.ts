"use server"

import { Query } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
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

    const result = await data.events.listRows([
      ...queries,
      Query.select([
        "*", // select all event attributes
        "etiquette.name", // We want basic etiquette info for performance
        "etiquette.color",
      ]),
    ])

    return result.documents as Events[]
  } catch (error) {
    console.error("Error getting calendar events:", error)
    return handleAppwriteError(error)
  }
}

export async function createEvent(
  event: Partial<Events> & { calendarId: string },
): Promise<Events | AppwriteError> {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not authenticated")

    const data = await db()

    const calendar = await data.calendars.getRow(event.calendarId)
    if (!calendar) throw new Error("Calendar not found")

    const permissions = await setPermissions(calendar.slug, user.$id)

    // Create event with relationships
    const eventData = {
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      all_day: event.all_day,
      location: event.location,
      calendar: event.calendarId,
      etiquette: event.etiquette?.$id,
      sede: event.sede?.$id,
      faculty: event.faculty?.$id,
      program: event.program?.$id,
    }

    const result = await data.events.createRow(eventData, permissions)
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

    const result = await data.events.updateRow(eventId, {
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      all_day: event.all_day,
      location: event.location,
      etiquette: event.etiquette?.$id,
    })
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
    await data.events.deleteRow(eventId)
    return true
  } catch (error) {
    console.error("Error deleting event:", error)
    return handleAppwriteError(error)
  }
}
