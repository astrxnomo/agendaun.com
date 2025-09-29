"use server"

import { Query } from "node-appwrite"

import { dbAdmin } from "@/lib/appwrite/db-admin"
import { handleError } from "@/lib/utils/error-handler"

import type { ScheduleCategories, Schedules } from "@/types"

/**
 * Get all schedule categories
 */
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

/**
 * Get schedules by category
 */
export async function getSchedulesByCategory(
  categoryId: string,
): Promise<Schedules[]> {
  try {
    const data = await dbAdmin()
    const result = await data.schedules.list([
      Query.equal("category", categoryId),
      Query.select(["*", "sede.*", "faculty.*", "program.*", "category.*"]),
      Query.orderAsc("name"),
    ])

    return result.rows as Schedules[]
  } catch (error) {
    console.error("Error fetching schedules by category:", error)
    handleError(error)
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(
  slug: string,
): Promise<ScheduleCategories | null> {
  try {
    const data = await dbAdmin()
    const result = await data.scheduleCategories.list([
      Query.equal("slug", slug),
      Query.limit(1),
    ])

    return (result.rows[0] as ScheduleCategories) || null
  } catch (error) {
    console.error("Error fetching category by slug:", error)
    handleError(error)
  }
}

/**
 * Get all schedules by sede
 */
export async function getSchedulesBySede(sedeId: string): Promise<Schedules[]> {
  try {
    const data = await dbAdmin()
    const result = await data.schedules.list([
      Query.equal("sede", sedeId),
      Query.select(["*", "sede.*", "faculty.*", "program.*"]),
      Query.orderAsc("name"),
    ])

    return result.rows as Schedules[]
  } catch (error) {
    console.error("Error fetching schedules by sede:", error)
    handleError(error)
  }
}

/**
 * Get all schedules by faculty
 */
export async function getSchedulesByFaculty(
  facultyId: string,
): Promise<Schedules[]> {
  try {
    const data = await dbAdmin()
    const result = await data.schedules.list([
      Query.equal("faculty", facultyId),
      Query.select(["*", "sede.*", "faculty.*", "program.*"]),
      Query.orderAsc("name"),
    ])

    return result.rows as Schedules[]
  } catch (error) {
    console.error("Error fetching schedules by faculty:", error)
    handleError(error)
  }
}

/**
 * Get all schedules by program
 */
export async function getSchedulesByProgram(
  programId: string,
): Promise<Schedules[]> {
  try {
    const data = await dbAdmin()
    const result = await data.schedules.list([
      Query.equal("program", programId),
      Query.select(["*", "sede.*", "faculty.*", "program.*"]),
      Query.orderAsc("name"),
    ])

    return result.rows as Schedules[]
  } catch (error) {
    console.error("Error fetching schedules by program:", error)
    handleError(error)
  }
}

/**
 * Get all schedules
 */
export async function getAllSchedules(): Promise<Schedules[]> {
  try {
    const data = await dbAdmin()
    const result = await data.schedules.list([
      Query.select(["*", "sede.*", "faculty.*", "program.*"]),
      Query.orderAsc("name"),
    ])

    return result.rows as Schedules[]
  } catch (error) {
    console.error("Error fetching all schedules:", error)
    handleError(error)
  }
}

/**
 * Get a specific schedule by ID
 */
export async function getScheduleById(
  scheduleId: string,
): Promise<Schedules | null> {
  try {
    const data = await dbAdmin()
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

/**
 * Get a specific schedule by slug
 */
export async function getScheduleBySlug(
  slug: string,
): Promise<Schedules | null> {
  try {
    const data = await dbAdmin()
    const result = await data.schedules.list([
      Query.equal("slug", slug),
      Query.select(["*", "sede.*", "faculty.*", "program.*"]),
      Query.limit(1),
    ])

    return (result.rows[0] as Schedules) || null
  } catch (error) {
    console.error("Error fetching schedule by slug:", error)
    handleError(error)
  }
}

/**
 * Create a new schedule
 */
export async function createSchedule(data: {
  name: string
  slug: string
  sede: string
  faculty: string
  program: string
}): Promise<Schedules | null> {
  try {
    const db = await dbAdmin()
    const result = await db.schedules.create(data)

    return result as Schedules
  } catch (error) {
    console.error("Error creating schedule:", error)
    handleError(error)
  }
}

/**
 * Update an existing schedule
 */
export async function updateSchedule(
  scheduleId: string,
  data: Partial<{
    name: string
    slug: string
    sede: string
    faculty: string
    program: string
  }>,
): Promise<Schedules | null> {
  try {
    const db = await dbAdmin()
    const result = await db.schedules.update(scheduleId, data)

    return result as Schedules
  } catch (error) {
    console.error("Error updating schedule:", error)
    handleError(error)
  }
}

/**
 * Delete a schedule
 */
export async function deleteSchedule(scheduleId: string): Promise<boolean> {
  try {
    const db = await dbAdmin()
    await db.schedules.delete(scheduleId)

    return true
  } catch (error) {
    console.error("Error deleting schedule:", error)
    handleError(error)
  }
}
