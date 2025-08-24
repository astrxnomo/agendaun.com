"use server"

import { Query } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { db } from "@/lib/appwrite/db"
import { type Etiquettes } from "@/types"

import { setPermissions } from "../utils/permissions"

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

export async function createEtiquette(
  etiquette: Partial<Etiquettes>,
): Promise<Etiquettes | null> {
  try {
    const user = await getUser()
    if (!user) throw new Error("User not authenticated")

    const data = await db()

    const calendar = await data.calendars.get(etiquette.calendar_id)
    if (!calendar) throw new Error("Calendar not found")

    const permissions = await setPermissions(calendar.slug, user.$id)

    const result = await data.etiquettes.create(etiquette, permissions)
    return result as Etiquettes
  } catch (error) {
    console.error("Error creating etiquette:", error)
    return null
  }
}

export async function updateEtiquette(
  etiquetteId: string,
  etiquette: Partial<Etiquettes>,
): Promise<Etiquettes | null> {
  try {
    const data = await db()

    const result = await data.etiquettes.update(etiquetteId, etiquette)
    return result as Etiquettes
  } catch (error) {
    console.error("Error updating etiquette:", error)
    return null
  }
}

export async function deleteEtiquette(etiquetteId: string): Promise<boolean> {
  try {
    const data = await db()
    await data.etiquettes.delete(etiquetteId)
    return true
  } catch (error) {
    console.error("Error deleting etiquette:", error)
    return false
  }
}
