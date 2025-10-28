"use server"
import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import {
  type CalendarEvents,
  type Calendars,
  type Profiles,
} from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getEvents(
  calendar: Calendars,
  profile?: Profiles,
): Promise<CalendarEvents[]> {
  const { database } = await createSessionClient()

  try {
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

    queries.push(Query.select(["*", "etiquette.*"]))

    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDAR_EVENTS,
      queries,
    })

    return result.rows as unknown as CalendarEvents[]
  } catch (error) {
    handleError(error)
  }
}
