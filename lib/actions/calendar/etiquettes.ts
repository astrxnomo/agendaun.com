"use server"

import { ID } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { calendarEtiquetteSchema } from "@/lib/data/schemas"
import { type CalendarEtiquettes } from "@/lib/data/types"
import { setPermissions } from "@/lib/utils/permissions"

export type EtiquetteActionState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    color?: string[]
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
      calendar: formData.get("calendar") as string,
      isActive: true,
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

    const etiquetteData = {
      name: validData.name.trim(),
      color: validData.color,
      isActive: validData.isActive,
      calendar: validData.calendar,
    }

    const permissions = await setPermissions(
      (validData.calendar as any)?.slug || null,
    )

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.ETIQUETTES,
      rowId: etiquetteId || ID.unique(),
      data: etiquetteData,
      permissions: etiquetteId ? undefined : permissions,
    })

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

export async function deleteEtiquette(
  etiquetteId: string,
): Promise<EtiquetteActionState> {
  try {
    const { database } = await createSessionClient()

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.ETIQUETTES,
      rowId: etiquetteId,
    })

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
