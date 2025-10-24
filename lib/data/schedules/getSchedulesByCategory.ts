"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import {
  type Profiles,
  type ScheduleCategories,
  type Schedules,
} from "@/lib/appwrite/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getSchedulesByCategory(
  categorySlug: string,
  profile: Profiles,
  page = 1,
  limit = 12,
): Promise<{
  schedules: Schedules[]
  category: ScheduleCategories | null
  total: number
  totalPages: number
  currentPage: number
}> {
  const { database } = await createSessionClient()

  try {
    const categoryResult = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_CATEGORIES,
      queries: [Query.equal("slug", categorySlug), Query.limit(1)],
    })

    const category = categoryResult.rows[0] as unknown as ScheduleCategories

    if (!category) {
      return {
        schedules: [],
        category: null,
        total: 0,
        totalPages: 0,
        currentPage: page,
      }
    }

    const queries = [Query.equal("category", category.$id)]
    if (profile?.sede) {
      queries.push(Query.equal("sede", profile.sede.$id))
    }

    queries.push(Query.select(["*", "sede.*", "category.*"]))
    queries.push(Query.orderDesc("$createdAt"))
    queries.push(Query.limit(limit))
    queries.push(Query.offset((page - 1) * limit))

    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULES,
      queries,
    })

    const totalPages = Math.ceil(result.total / limit)

    return {
      schedules: result.rows as unknown as Schedules[],
      category,
      total: result.total,
      totalPages,
      currentPage: page,
    }
  } catch (error) {
    console.error(
      `Error getting schedules for category ${categorySlug}:`,
      error,
    )
    handleError(error)
  }
}
