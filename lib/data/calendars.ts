import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { type Calendars } from "@/types/db"

export async function getCalendar(slug: string): Promise<Calendars | null> {
  const data = await db()

  const result = await data.calendars.list([Query.equal("slug", slug)])

  return result.documents[0] as Calendars
}
