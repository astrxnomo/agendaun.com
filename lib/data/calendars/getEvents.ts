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
    if (calendar.slug === "unal") {
      const queries = [Query.equal("calendar", calendar.$id)]

      if (profile && profile.sede && profile.faculty && profile.program) {
        queries.push(
          Query.or([
            Query.and([
              Query.isNull("sede"),
              Query.isNull("faculty"),
              Query.isNull("program"),
            ]),
            Query.equal("sede", profile.sede.$id),
            Query.equal("faculty", profile.faculty.$id),
            Query.equal("program", profile.program.$id),
          ]),
        )
      } else {
        queries.push(Query.isNull("sede"))
        queries.push(Query.isNull("faculty"))
        queries.push(Query.isNull("program"))
      }

      queries.push(
        Query.select([
          "*",
          "calendar.slug",
          "etiquette.*",
          "sede.*",
          "faculty.*",
          "faculty.sede.*",
          "program.*",
          "program.faculty.*",
          "program.faculty.sede.*",
          "created_by.*",
        ]),
      )

      const result = await database.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLES.CALENDAR_EVENTS,
        queries,
      })

      return result.rows as unknown as CalendarEvents[]
    }

    const queries = [
      Query.equal("calendar", calendar.$id),
      Query.select(["*", "etiquette.*"]),
    ]

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
