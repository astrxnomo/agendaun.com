import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { type Events } from "@/types/db"

import { getCalendar } from "./calendars"

export async function getEvents(calendarSlug: string): Promise<Events[]> {
  const calendar = await getCalendar(calendarSlug)
  if (!calendar) return []

  const data = await db()

  const result = await data.events.list([
    Query.equal("calendar_id", calendar.$id),
  ])

  return result.documents as Events[]
}
