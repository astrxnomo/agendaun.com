"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Calendars } from "@/lib/appwrite/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getCalendarBySlug(
  slug: string,
): Promise<Calendars | null> {
  const { database } = await createSessionClient()

  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDARS,
      queries: [
        Query.equal("slug", slug),
        Query.select(["*", "profile.user_id", "etiquettes.*"]),
      ],
    })

    return (result.rows[0] as unknown as Calendars) || null
  } catch (error) {
    console.error(`Error getting calendar with slug ${slug}:`, error)
    handleError(error)
  }
}
