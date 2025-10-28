"use server"

import { revalidatePath } from "next/cache"
import { ID } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { getProfile } from "@/lib/data/profiles/getProfile"
import { type Schedules } from "@/lib/data/types"
import { getUser } from "@/lib/data/users/getUser"
import { handleError } from "@/lib/utils/error-handler"

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
