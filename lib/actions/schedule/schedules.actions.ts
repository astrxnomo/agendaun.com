"use server"

import { revalidatePath } from "next/cache"
import { ID, Query } from "node-appwrite"

import { getUser } from "@/lib/appwrite/dal"
import { type Profiles, type ScheduleCategories, type Schedules } from "@/types"

import { db } from "../../appwrite/db"
import { dbAdmin } from "../../appwrite/db-admin"
import { handleError } from "../../utils/error-handler"
import { getProfile } from "../profiles.actions"

export async function getAllScheduleCategories(): Promise<
  ScheduleCategories[]
> {
  try {
    const data = await dbAdmin()
    const result = await data.scheduleCategories.list([Query.orderAsc("name")])

    return result.rows as ScheduleCategories[]
  } catch (error) {
    console.error("Error fetching schedule categories:", error)
    handleError(error)
  }
}

export async function getSchedulesByCategory(
  categorySlug: string,
  profile: Profiles,
): Promise<{
  schedules: Schedules[]
  category: ScheduleCategories | null
}> {
  const data = await db()

  try {
    const categoryResult = await data.scheduleCategories.list([
      Query.equal("slug", categorySlug),
      Query.limit(1),
    ])

    const category = categoryResult.rows[0] as ScheduleCategories

    if (!category) {
      return { schedules: [], category: null }
    }

    const queries = [Query.equal("category", category.$id)]
    if (profile?.sede) {
      queries.push(Query.equal("sede", profile.sede.$id))
    }

    const result = await data.schedules.list([
      ...queries,
      Query.select(["*", "sede.*", "category.*"]),
      Query.orderAsc("name"),
    ])

    return {
      schedules: result.rows as Schedules[],
      category,
    }
  } catch (error) {
    console.error(
      `Error getting schedules for category ${categorySlug}:`,
      error,
    )
    handleError(error)
  }
}

export async function getScheduleById(
  scheduleId: string,
): Promise<Schedules | null> {
  try {
    const data = await db()
    const result = await data.schedules.list([
      Query.equal("$id", scheduleId),
      Query.select(["*", "sede.*", "category.*"]),
      Query.limit(1),
    ])

    return (result.rows[0] as Schedules) || null
  } catch (error) {
    console.error(`Error getting schedule with id ${scheduleId}:`, error)
    handleError(error)
  }
}

export async function createSchedule(
  schedule: Partial<Schedules>,
): Promise<Schedules> {
  try {
    const user = await getUser()
    if (!user) throw new Error("No autenticado")

    const profile = await getProfile(user.$id)
    if (!profile?.sede) {
      throw new Error("El usuario no tiene una sede asignada")
    }

    const data = await db()
    const result = await data.schedules.upsert(
      ID.unique(),
      {
        ...schedule,
        sede: profile.sede.$id,
      },
      [],
    )

    revalidatePath("/schedules")
    return result as Schedules
  } catch (error) {
    console.error("Error creating schedule:", error)
    handleError(error)
  }
}

export async function updateSchedule(schedule: Schedules): Promise<Schedules> {
  try {
    const data = await db()
    const result = await data.schedules.upsert(schedule.$id, schedule, [])

    revalidatePath("/schedules")
    return result as Schedules
  } catch (error) {
    console.error("Error updating schedule:", error)
    handleError(error)
  }
}

export async function deleteSchedule(scheduleId: string): Promise<boolean> {
  try {
    const data = await db()
    await data.schedules.delete(scheduleId)

    revalidatePath("/schedules")
    return true
  } catch (error) {
    console.error("Error deleting schedule:", error)
    handleError(error)
  }
}
