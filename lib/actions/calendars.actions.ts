"use server"

import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { type Calendars } from "@/types"

import { handleError } from "../utils/error-handler"

export async function getCalendarBySlug(
  slug: string,
): Promise<Calendars | null> {
  try {
    const data = await db()
    const result = await data.calendars.list([
      Query.equal("slug", slug),
      Query.select(["*", "profile.user_id", "etiquettes.*"]),
    ])

    return (result.rows[0] as Calendars) || null
  } catch (error) {
    console.error(`Error getting calendar with slug ${slug}:`, error)
    handleError(error)
  }
}
