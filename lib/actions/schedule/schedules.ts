"use server"

import { revalidatePath } from "next/cache"
import { ID } from "node-appwrite"

import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { scheduleSchema } from "@/lib/data/schemas"
import { type ScheduleCategories, type Schedules } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"
import { setSchedulePermissions } from "@/lib/utils/permissions"
import { canAdminSchedule } from "../users"

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
      sede: (formData.get("sede") as string) || null,
      faculty: (formData.get("faculty") as string) || null,
      program: (formData.get("program") as string) || null,
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

    const existingSchedule: Schedules | null = formData.get("schedule")
      ? JSON.parse(formData.get("schedule") as string)
      : null

    const categoryData: ScheduleCategories | null = formData.get("categoryData")
      ? JSON.parse(formData.get("categoryData") as string)
      : null

    const { database } = (await canAdminSchedule(categoryData as any))
      ? await createAdminClient()
      : await createSessionClient()

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
    const scheduleIdToUse = existingSchedule?.$id || ID.unique()
    const scheduleCategorySlug = existingSchedule?.category?.slug || ""
    const permissions = await setSchedulePermissions(
      scheduleIdToUse,
      scheduleCategorySlug,
    )

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULES,
      rowId: scheduleIdToUse,
      data: scheduleData,
      permissions: permissions,
    })

    revalidatePath("/schedules")

    return {
      success: true,
      message: existingSchedule
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

export async function deleteSchedule(schedule: Schedules): Promise<boolean> {
  try {
    const isAdmin = await canAdminSchedule(schedule.category)
    const client = isAdmin
      ? await createAdminClient()
      : await createSessionClient()

    const { database } = client

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULES,
      rowId: schedule.$id,
    })

    revalidatePath("/schedules")
    return true
  } catch (error) {
    console.error("Error deleting schedule:", error)
    handleError(error)
  }
}
