"use server"

import { Permission, Query, Role } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { db } from "@/lib/appwrite/db"
import { Colors, type Etiquettes } from "@/types"

/**
 * Limpia los datos de la etiqueta para envío a Appwrite
 */
function cleanEtiquetteData(etiquette: Partial<Etiquettes>) {
  return {
    name: etiquette.name,
    color: etiquette.color,
    isActive: etiquette.isActive ?? true,
    calendar_id: etiquette.calendar_id,
  }
}

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

    // Limpiar los datos
    const cleanEtiquette = cleanEtiquetteData(etiquette)

    // Permisos para el usuario creador
    const permissions = [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ]

    const result = await data.etiquettes.create(cleanEtiquette, permissions)
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

    // Limpiar los datos
    const cleanEtiquette = cleanEtiquetteData(etiquette)

    const result = await data.etiquettes.update(etiquetteId, cleanEtiquette)
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
