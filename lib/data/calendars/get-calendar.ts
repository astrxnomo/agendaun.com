import { Query } from "node-appwrite"

import { createAdminClient } from "@/lib/appwrite"
import { type Calendars } from "@/types/db"

export async function getCalendarBySlug(
  slug: string,
): Promise<Calendars | null> {
  const { database } = await createAdminClient()
  const result = await database.listDocuments(
    "689ff4450021b29bd0c1",
    "689ff45a00220a375290",
    [Query.equal("slug", slug)],
  )
  return (result.documents[0] as Calendars) || null
}
