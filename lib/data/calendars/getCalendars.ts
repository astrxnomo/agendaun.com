"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Calendars } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getCalendars(): Promise<Calendars[]> {
  const { database } = await createSessionClient()

  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDARS,
      queries: [Query.isNull("profile")],
    })

    return result.rows as unknown as Calendars[]
  } catch (error) {
    console.error("Error getting public calendars:", error)
    handleError(error)
  }
}
