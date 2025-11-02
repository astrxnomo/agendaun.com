"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Faculties } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getFacultyById(facultyId: string): Promise<Faculties> {
  const { database } = await createSessionClient()

  try {
    const result = await database.getRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.FACULTIES,
      rowId: facultyId,
      queries: [Query.select(["*", "sede.*"])],
    })

    return result as unknown as Faculties
  } catch (error) {
    handleError(error)
  }
}
