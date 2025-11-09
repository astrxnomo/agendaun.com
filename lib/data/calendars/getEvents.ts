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
    const isUnal = calendar.slug === "unal"

    const queries = [
      Query.equal("calendar", calendar.$id),
      Query.limit(1000),
      Query.select([
        "*",
        "calendar.slug",
        "calendar.profile.user_id",
        "etiquette.name",
        "etiquette.color",
        "etiquette.isActive",
        "sede.*",
        "faculty.*",
        "faculty.sede.*",
        "program.*",
        "program.faculty.*",
        "program.faculty.sede.*",
        "created_by.user_id",
        "created_by.email",
      ]),
    ]

    if (isUnal && profile) {
      if (profile.sede) {
        queries.push(
          Query.or([
            Query.isNull("sede"),
            Query.equal("sede", profile.sede.$id),
          ]),
        )
      } else {
        queries.push(Query.isNull("sede"))
      }

      if (profile.faculty) {
        queries.push(
          Query.or([
            Query.isNull("faculty"),
            Query.equal("faculty", profile.faculty.$id),
          ]),
        )
      } else {
        queries.push(Query.isNull("faculty"))
      }

      if (profile.program) {
        queries.push(
          Query.or([
            Query.isNull("program"),
            Query.equal("program", profile.program.$id),
          ]),
        )
      } else {
        queries.push(Query.isNull("program"))
      }
    } else if (isUnal) {
      queries.push(
        Query.isNull("sede"),
        Query.isNull("faculty"),
        Query.isNull("program"),
      )
    }

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
