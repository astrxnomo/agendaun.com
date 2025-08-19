"use server"

import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { Colors, type Etiquettes } from "@/types"

export async function getEtiquettes(calendarId: string): Promise<Etiquettes[]> {
  try {
    const data = await db()
    const result = await data.etiquettes.list([
      Query.equal("calendar_id", calendarId),
    ])

    return result.documents as Etiquettes[]
  } catch (error) {
    console.error("Error getting etiquettes:", error)
    return []
  }
}

export async function getColor(
  calendarId: string,
  etiquetteId: string,
): Promise<Colors> {
  try {
    const etiquettes = await getEtiquettes(calendarId)
    const etiquette = etiquettes.find((e) => e.$id === etiquetteId)
    return etiquette?.color ?? Colors.GRAY
  } catch (error) {
    console.error("Error getting color:", error)
    return Colors.GRAY
  }
}
