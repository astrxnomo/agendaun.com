import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { Colors, type Etiquettes } from "@/types/db"

import { getCalendar } from "./calendars"

export async function getEtiquettes(
  calendarSlug: string,
): Promise<Etiquettes[]> {
  const calendar = await getCalendar(calendarSlug)
  if (!calendar) return []

  const data = await db()

  const result = await data.etiquettes.list([
    Query.equal("calendar_id", calendar.$id),
  ])

  return result.documents as Etiquettes[]
}

export async function getColor(
  calendarSlug: string,
  etiquetteId: string,
): Promise<Colors> {
  const etiquettes = await getEtiquettes(calendarSlug)
  const etiquette = etiquettes.find((e) => e.$id === etiquetteId)

  return etiquette?.color ?? Colors.GRAY
}
