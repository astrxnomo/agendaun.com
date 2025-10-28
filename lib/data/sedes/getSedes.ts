"use server"

import { Query } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Sedes } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getSedes(): Promise<Sedes[]> {
  const { database } = await createSessionClient()

  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES.SEDES,
      queries: [Query.orderAsc("name"), Query.limit(100)],
    })

    return result.rows as unknown as Sedes[]
  } catch (error) {
    handleError(error)
  }
}
