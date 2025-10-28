"use server"

import { revalidatePath } from "next/cache"
import { ID } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { calendarEtiquetteSchema } from "@/lib/data/schemas"
import { type CalendarEtiquettes } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"
import { setPermissions } from "@/lib/utils/permissions"

export type EtiquetteActionState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    color?: string[]
    isActive?: string[]
    calendar?: string[]
    _form?: string[]
  }
  data?: CalendarEtiquettes
}

export async function saveEtiquette(
  prevState: EtiquetteActionState,
  formData: FormData,
): Promise<EtiquetteActionState> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      color: formData.get("color") as string,
      isActive: formData.get("isActive") === "true",
      calendar: formData.get("calendar") as string,
    }

    const validationResult = calendarEtiquetteSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Error de validación",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const validData = validationResult.data

    const { database } = await createSessionClient()

    const etiquetteId = formData.get("etiquetteId") as string | null

    const calendarSlug = formData.get("calendarSlug") as string
    const permissions = await setPermissions(calendarSlug)

    const etiquetteData = {
      name: validData.name,
      color: validData.color,
      isActive: validData.isActive,
      calendar: validData.calendar,
    }

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.ETIQUETTES,
      rowId: etiquetteId || ID.unique(),
      data: etiquetteData,
      permissions: etiquetteId ? undefined : permissions,
    })

    revalidatePath(`/calendars/[slug]`, "page")

    return {
      success: true,
      message: etiquetteId
        ? "Etiqueta actualizada correctamente"
        : "Etiqueta creada correctamente",
      data: result as unknown as CalendarEtiquettes,
    }
  } catch (error) {
    console.error("Error saving etiquette:", error)
    return {
      success: false,
      message: "Error al guardar la etiqueta",
      errors: {
        _form: [error instanceof Error ? error.message : "Error desconocido"],
      },
    }
  }
}

export async function deleteEtiquetteAction(
  etiquetteId: string,
): Promise<EtiquetteActionState> {
  try {
    const { database } = await createSessionClient()

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.ETIQUETTES,
      rowId: etiquetteId,
    })

    revalidatePath(`/calendars/[slug]`, "page")

    return {
      success: true,
      message: "Etiqueta eliminada correctamente",
    }
  } catch (error) {
    console.error("Error deleting etiquette:", error)
    return {
      success: false,
      message: "Error al eliminar la etiqueta",
      errors: {
        _form: [error instanceof Error ? error.message : "Error desconocido"],
      },
    }
  }
}

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
