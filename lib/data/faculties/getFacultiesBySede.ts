"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Faculties } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getFacultiesBySede(sedeId: string): Promise<Faculties[]> {
  const { database } = await createSessionClient()

  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.FACULTIES,
      queries: [
        Query.equal("sede", sedeId),
        Query.orderAsc("name"),
        Query.limit(100),
      ],
    })

    return result.rows as unknown as Faculties[]
  } catch (error) {
    handleError(error)
  }
}
