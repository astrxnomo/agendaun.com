"use server"

import { Query } from "node-appwrite"

import { getUser } from "@/lib/appwrite/auth"
import { db } from "@/lib/appwrite/db"
import { handleError } from "@/lib/utils/error-handler"

import { getProfile } from "../profiles.actions"

import type { ScheduleCategories, Schedules } from "@/types"

export async function getAllScheduleCategories(): Promise<
  ScheduleCategories[]
> {
  try {
    const data = await db()
    const result = await data.scheduleCategories.list([Query.orderAsc("name")])

    return result.rows as ScheduleCategories[]
  } catch (error) {
    console.error("Error fetching schedule categories:", error)
    handleError(error)
  }
}

export async function getSchedulesByCategory(
  categorySlugOrId: string,
): Promise<{
  schedules: Schedules[]
  category: ScheduleCategories | null
}> {
  try {
    const user = await getUser()
    const profile = user ? await getProfile(user.$id) : null

    const data = await db()

    // First, get the category by slug to get its ID
    const categoryResult = await data.scheduleCategories.list([
      Query.equal("slug", categorySlugOrId),
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
      Query.select(["*", "sede.*", "faculty.*", "program.*", "category.*"]),
      Query.orderAsc("name"),
    ])

    return {
      schedules: result.rows as Schedules[],
      category,
    }
  } catch (error) {
    console.error("Error fetching schedules by category:", error)
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
      Query.select(["*", "sede.*", "faculty.*", "program.*", "category.*"]),
      Query.limit(1),
    ])

    return (result.rows[0] as Schedules) || null
  } catch (error) {
    console.error("Error fetching schedule by ID:", error)
    handleError(error)
  }
}
