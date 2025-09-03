"use server"

import { ID } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { db } from "@/lib/appwrite/db"
import { type Etiquettes } from "@/types"

import { handleAppwriteError, type AppwriteError } from "../utils/error-handler"
import { setPermissions } from "../utils/permissions"

export async function createEtiquette(
  etiquette: Partial<Etiquettes>,
): Promise<Etiquettes | AppwriteError> {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not authenticated")

    const data = await db()

    const permissions = await setPermissions(etiquette.calendar?.slug)

    // TablesDB can handle the relationship automatically
    const result = await data.etiquettes.upsert(
      ID.unique(),
      etiquette,
      permissions,
    )
    return result as Etiquettes
  } catch (error) {
    console.error("Error creating etiquette:", error)
    return handleAppwriteError(error)
  }
}

export async function updateEtiquette(
  etiquetteId: string,
  etiquette: Partial<Etiquettes>,
): Promise<Etiquettes | AppwriteError> {
  try {
    const data = await db()

    const result = await data.etiquettes.upsert(etiquetteId, etiquette)
    return result as Etiquettes
  } catch (error) {
    console.error("Error updating etiquette:", error)
    return handleAppwriteError(error)
  }
}

export async function deleteEtiquette(
  etiquetteId: string,
): Promise<boolean | AppwriteError> {
  try {
    const data = await db()
    await data.etiquettes.delete(etiquetteId)
    return true
  } catch (error) {
    console.error("Error deleting etiquette:", error)
    return handleAppwriteError(error)
  }
}
