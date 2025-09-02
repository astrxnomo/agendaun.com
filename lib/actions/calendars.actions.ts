"use server"

import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { type Calendars } from "@/types"

import { handleAppwriteError, type AppwriteError } from "../utils/error-handler"

export async function getCalendarBySlug(
  slug: string,
): Promise<Calendars | AppwriteError | null> {
  try {
    const data = await db()
    const result = await data.calendars.listRows([
      Query.equal("slug", slug),
      Query.select(["*"]), // Get calendar attributes
    ])
    return (result.documents[0] as Calendars) || null
  } catch (error) {
    console.error(`Error getting calendar with slug ${slug}:`, error)
    return handleAppwriteError(error)
  }
}
