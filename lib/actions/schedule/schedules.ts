"use server"

import { revalidatePath } from "next/cache"
import { ID } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { getProfile } from "@/lib/data/profiles/getProfile"
import { scheduleSchema } from "@/lib/data/schemas"
import { type Schedules } from "@/lib/data/types"
import { getUser } from "@/lib/data/users/getUser"
import { handleError } from "@/lib/utils/error-handler"

export type ScheduleActionState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    description?: string[]
    sede?: string[]
    faculty?: string[]
    program?: string[]
    category?: string[]
    _form?: string[]
  }
  data?: Schedules
}

export async function saveSchedule(
  prevState: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  try {
    // Primero obtener el perfil del usuario para la sede
    const user = await getUser()
    const profile = await getProfile(user.$id)

    if (!profile?.sede) {
      return {
        success: false,
        message: "El usuario no tiene una sede asignada",
        errors: { _form: ["El usuario no tiene una sede asignada"] },
      }
    }

    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      sede: profile.sede.$id, // Usar la sede del perfil
      faculty: profile.faculty?.$id || null,
      program: profile.program?.$id || null,
      category: formData.get("category") as string,
      start_hour: parseInt(formData.get("start_hour") as string) || 6,
      end_hour: parseInt(formData.get("end_hour") as string) || 22,
    }

    const validationResult = scheduleSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Error de validación",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const validData = validationResult.data

    const { database } = await createSessionClient()

    const scheduleId = formData.get("scheduleId") as string | null

    const scheduleData = {
      name: validData.name,
      description: validData.description || null,
      sede: validData.sede,
      faculty: validData.faculty || null,
      program: validData.program || null,
      category: validData.category,
      start_hour: validData.start_hour,
      end_hour: validData.end_hour,
    }

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULES,
      rowId: scheduleId || ID.unique(),
      data: scheduleData,
      permissions: [],
    })

    revalidatePath("/schedules")

    return {
      success: true,
      message: scheduleId
        ? "Horario actualizado correctamente"
        : "Horario creado correctamente",
      data: result as unknown as Schedules,
    }
  } catch (error) {
    console.error("Error saving schedule:", error)
    return {
      success: false,
      message: "Error al guardar el horario",
      errors: {
        _form: [error instanceof Error ? error.message : "Error desconocido"],
      },
    }
  }
}

export async function deleteSchedule(scheduleId: string): Promise<boolean> {
  try {
    const sessionClient = await createSessionClient()
    if (!sessionClient) {
      throw new Error("No hay sesión activa")
    }

    const { database } = sessionClient

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULES,
      rowId: scheduleId,
    })

    revalidatePath("/schedules")
    return true
  } catch (error) {
    console.error("Error deleting schedule:", error)
    handleError(error)
  }
}
