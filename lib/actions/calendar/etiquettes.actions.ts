"use server"

import { ID } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { handleError } from "@/lib/utils/error-handler"
import { setPermissions } from "@/lib/utils/permissions"
import { type CalendarEtiquettes } from "@/types"

export async function createEtiquette(
  etiquette: CalendarEtiquettes,
): Promise<CalendarEtiquettes> {
  try {
    const data = await db()
    const permissions = await setPermissions(etiquette.calendar?.slug)

    const result = await data.etiquettes.upsert(
      ID.unique(),
      etiquette,
      permissions,
    )

    return result as CalendarEtiquettes
  } catch (error) {
    console.error("Error creating etiquette:", error)
    handleError(error)
  }
}

export async function updateEtiquette(
  etiquette: CalendarEtiquettes,
): Promise<CalendarEtiquettes> {
  try {
    const data = await db()
    const result = await data.etiquettes.upsert(etiquette.$id, etiquette)

    return result as CalendarEtiquettes
  } catch (error) {
    console.error("Error updating etiquette:", error)
    handleError(error)
  }
}

export async function deleteEtiquette(etiquetteId: string): Promise<boolean> {
  try {
    const data = await db()
    const result = await data.etiquettes.delete(etiquetteId)

    return result as boolean
  } catch (error) {
    console.error("Error deleting etiquette:", error)
    handleError(error)
  }
}
