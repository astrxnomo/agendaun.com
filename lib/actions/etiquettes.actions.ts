"use server"

import { Query } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { db } from "@/lib/appwrite/db"
import { type Etiquettes } from "@/types"

import { handleAppwriteError, type AppwriteError } from "../utils/error-handler"
import { setPermissions } from "../utils/permissions"

export async function getEtiquettes(
  calendarId: string,
): Promise<Etiquettes[] | AppwriteError> {
  try {
    const data = await db()
    const result = await data.etiquettes.listRows([
      Query.equal("calendar", calendarId), // Query by relationship field directly
      Query.select([
        "*", // select all top-level attributes
        "calendar.*", // select all calendar relationship attributes
      ]),
    ])

    return result.documents as Etiquettes[]
  } catch (error) {
    console.error("Error getting etiquettes:", error)
    return handleAppwriteError(error)
  }
}

export async function createEtiquette(
  etiquette: Partial<Etiquettes> & { calendarId: string },
): Promise<Etiquettes | AppwriteError> {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not authenticated")

    const data = await db()

    const calendar = await data.calendars.getRow(etiquette.calendarId)
    if (!calendar) throw new Error("Calendar not found")

    const permissions = await setPermissions(calendar.slug, user.$id)

    // Create etiquette with relationship
    const etiquetteData = {
      name: etiquette.name,
      color: etiquette.color,
      isActive: etiquette.isActive,
      calendar: etiquette.calendarId,
    }

    const result = await data.etiquettes.createRow(etiquetteData, permissions)
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

    const result = await data.etiquettes.updateRow(etiquetteId, etiquette)
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
    await data.etiquettes.deleteRow(etiquetteId)
    return true
  } catch (error) {
    console.error("Error deleting etiquette:", error)
    return handleAppwriteError(error)
  }
}
