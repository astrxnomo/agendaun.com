import { Query } from "node-appwrite"

import { createAdminClient } from "@/lib/appwrite"
import { type Etiquettes } from "@/types/db"

export async function getEtiquettesByCalendarSlug(
  calendarSlug: string,
): Promise<Etiquettes[]> {
  const { database } = await createAdminClient()

  const result = await database.listDocuments(
    "689ff4450021b29bd0c1",
    "689ff462000c1fe07334",
    [Query.equal("calendars.slug", calendarSlug)],
  )
  return result.documents as Etiquettes[]
}
