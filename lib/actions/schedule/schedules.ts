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
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      sede: formData.get("sede") as string,
      faculty: formData.get("faculty") as string | null,
      program: formData.get("program") as string | null,
      category: formData.get("category") as string,
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

    const user = await getUser()
    const profile = await getProfile(user.$id)
    if (!profile?.sede) {
      return {
        success: false,
        message: "El usuario no tiene una sede asignada",
        errors: { _form: ["El usuario no tiene una sede asignada"] },
      }
    }

    const { database } = await createSessionClient()

    const scheduleId = formData.get("scheduleId") as string | null

    const scheduleData = {
      name: validData.name,
      description: validData.description || null,
      sede: profile.sede.$id,
      faculty: validData.faculty || null,
      program: validData.program || null,
      category: validData.category,
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

export async function createSchedule(
  schedule: Partial<Schedules>,
): Promise<Schedules> {
  try {
    const user = await getUser()

    const { database } = await createSessionClient()

    const profile = await getProfile(user.$id)
    if (!profile?.sede) {
      throw new Error("El usuario no tiene una sede asignada")
    }

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULES,
      rowId: ID.unique(),
      data: {
        ...schedule,
        sede: profile.sede.$id,
      },
      permissions: [],
    })

    revalidatePath("/schedules")
    return result as unknown as Schedules
  } catch (error) {
    console.error("Error creating schedule:", error)
    handleError(error)
  }
}

export async function updateSchedule(schedule: Schedules): Promise<Schedules> {
  try {
    const sessionClient = await createSessionClient()
    if (!sessionClient) {
      throw new Error("No hay sesión activa")
    }

    const { database } = sessionClient

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULES,
      rowId: schedule.$id,
      data: schedule,
      permissions: [],
    })

    revalidatePath("/schedules")
    return result as unknown as Schedules
  } catch (error) {
    console.error("Error updating schedule:", error)
    handleError(error)
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
