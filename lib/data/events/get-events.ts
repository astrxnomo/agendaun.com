import { Query } from "node-appwrite"

import { getCalendarBySlug } from "@/lib/data/calendars/get-calendar"
import { type Events } from "@/types/db"

export async function getEventsByCalendarSlug(
  calendarSlug: string,
): Promise<Events[]> {
  const calendar = await getCalendarBySlug(calendarSlug)
  if (!calendar) return []

  const result = await database.listDocuments(
    "689ff4450021b29bd0c1",
    "689ff45400348f059413",
    [Query.equal("calendars", calendar.$id)],
  )
  return result.documents as Events[]
}
