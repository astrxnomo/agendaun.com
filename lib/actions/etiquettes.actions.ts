"use server"

import { ID } from "node-appwrite"

import { db } from "@/lib/appwrite/db"
import { type Etiquettes } from "@/types"

import { handleError } from "../utils/error-handler"
import { setPermissions } from "../utils/permissions"

export async function createEtiquette(
  etiquette: Etiquettes,
): Promise<Etiquettes> {
  try {
    const data = await db()
    const permissions = await setPermissions(etiquette.calendar?.slug)

    const result = await data.etiquettes.upsert(
      ID.unique(),
      etiquette,
      permissions,
    )

    return result as Etiquettes
  } catch (error) {
    console.error("Error creating etiquette:", error)
    handleError(error)
  }
}

export async function updateEtiquette(
  etiquette: Etiquettes,
): Promise<Etiquettes> {
  try {
    const data = await db()
    const result = await data.etiquettes.upsert(etiquette.$id, etiquette)

    return result as Etiquettes
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
