"use server"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { type Sedes } from "@/lib/data/types"
import { handleError } from "@/lib/utils/error-handler"

export async function getSedeById(sedeId: string): Promise<Sedes> {
  const { database } = await createSessionClient()

  try {
    const result = await database.getRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SEDES,
      rowId: sedeId,
    })

    return result as unknown as Sedes
  } catch (error) {
    handleError(error)
  }
}
