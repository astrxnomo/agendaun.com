"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import {
  type Profiles,
  type ScheduleCategories,
  type Schedules,
} from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getSchedulesByCategory(
  categorySlug: string,
  profile: Profiles | null,
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

    if (profile) {
      if (profile.sede) {
        queries.push(
          Query.or([
            Query.isNull("sede"),
            Query.equal("sede", profile.sede.$id),
          ]),
        )
      } else {
        queries.push(Query.isNull("sede"))
      }

      if (profile.faculty) {
        queries.push(
          Query.or([
            Query.isNull("faculty"),
            Query.equal("faculty", profile.faculty.$id),
          ]),
        )
      } else {
        queries.push(Query.isNull("faculty"))
      }

      if (profile.program) {
        queries.push(
          Query.or([
            Query.isNull("program"),
            Query.equal("program", profile.program.$id),
          ]),
        )
      } else {
        queries.push(Query.isNull("program"))
      }
    } else {
      queries.push(Query.isNull("sede"))
      queries.push(Query.isNull("faculty"))
      queries.push(Query.isNull("program"))
    }

    queries.push(
      Query.select([
        "*",
        "category.*",
        "sede.*",
        "faculty.*",
        "faculty.sede.*",
        "program.*",
        "program.faculty.*",
        "program.faculty.sede.*",
      ]),
    )
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
