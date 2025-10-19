"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Programs } from "@/lib/appwrite/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getProgramsByFaculty(
  facultyId: string,
): Promise<Programs[]> {
  const { database } = await createSessionClient()

  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.PROGRAMS,
      queries: [
        Query.equal("faculty", facultyId),
        Query.orderAsc("name"),
        Query.limit(100),
      ],
    })

    return result.rows as unknown as Programs[]
  } catch (error) {
    handleError(error)
  }
}
