"use server"

import { ID } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type CalendarEtiquettes } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"
import { setPermissions } from "@/lib/utils/permissions"

export async function createEtiquette(
  etiquette: CalendarEtiquettes,
): Promise<CalendarEtiquettes> {
  try {
    const { database } = await createSessionClient()
    const permissions = await setPermissions(etiquette.calendar?.slug)

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.ETIQUETTES,
      rowId: ID.unique(),
      data: etiquette,
      permissions,
    })

    return result as unknown as CalendarEtiquettes
  } catch (error) {
    console.error("Error creating etiquette:", error)
    handleError(error)
  }
}

export async function updateEtiquette(
  etiquette: CalendarEtiquettes,
): Promise<CalendarEtiquettes> {
  try {
    const { database } = await createSessionClient()

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.ETIQUETTES,
      rowId: etiquette.$id,
      data: etiquette,
    })

    return result as unknown as CalendarEtiquettes
  } catch (error) {
    console.error("Error updating etiquette:", error)
    handleError(error)
  }
}

export async function deleteEtiquette(etiquetteId: string): Promise<boolean> {
  try {
    const { database } = await createSessionClient()

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.ETIQUETTES,
      rowId: etiquetteId,
    })

    return true
  } catch (error) {
    console.error("Error deleting etiquette:", error)
    handleError(error)
  }
}
