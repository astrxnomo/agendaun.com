import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { EtiquetteColor, type Etiquettes } from "@/types/db"

import { getCalendarBySlug } from "../calendars/get-calendar"

export async function getEtiquettesByCalendarSlug(
  calendarSlug: string,
  session?: string,
): Promise<Etiquettes[]> {
  const { database } = await createSessionClient(session ?? "")

  const calendar = await getCalendarBySlug(calendarSlug)
  if (!calendar) return []

  const result = await database.listDocuments(
    "689ff4450021b29bd0c1",
    "689ff462000c1fe07334",
    [Query.equal("calendar_id", calendar.$id)],
  )

  return result.documents as Etiquettes[]
}

export async function getEtiquetteColor(
  calendarSlug: string,
  etiquetteId: string,
  session?: string,
): Promise<EtiquetteColor> {
  const etiquettes = await getEtiquettesByCalendarSlug(calendarSlug, session)
  const etiquette = etiquettes.find((e) => e.$id === etiquetteId)

  return etiquette?.color ?? EtiquetteColor.GRAY
}
