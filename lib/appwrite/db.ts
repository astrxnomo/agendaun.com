import { createSessionClient } from "@/lib/appwrite/config"

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!

// Using TablesDB API
const tables = [
  { name: "events", id: process.env.NEXT_PUBLIC_COLLECTION_EVENTS! },
  { name: "calendars", id: process.env.NEXT_PUBLIC_COLLECTION_CALENDARS! },
  { name: "etiquettes", id: process.env.NEXT_PUBLIC_COLLECTION_ETIQUETTES! },
  { name: "sedes", id: process.env.NEXT_PUBLIC_COLLECTION_SEDES! },
  { name: "faculties", id: process.env.NEXT_PUBLIC_COLLECTION_FACULTIES! },
  { name: "programs", id: process.env.NEXT_PUBLIC_COLLECTION_PROGRAMS! },
  { name: "profiles", id: process.env.NEXT_PUBLIC_COLLECTION_PROFILES! },
]

export async function db() {
  const { database } = await createSessionClient()
  const api: Record<string, any> = {}

  tables.forEach((table) => {
    api[table.name] = {
      upsert: async (rowId: string, data: any, permissions?: string[]) =>
        database.upsertRow({
          databaseId: DATABASE_ID,
          tableId: table.id,
          rowId,
          data,
          ...(permissions && { permissions }),
        }),
      delete: async (id: string) =>
        database.deleteRow({
          databaseId: DATABASE_ID,
          tableId: table.id,
          rowId: id,
        }),
      get: async (id: string, queries: any[] = []) =>
        database.getRow({
          databaseId: DATABASE_ID,
          tableId: table.id,
          rowId: id,
          queries,
        }),
      list: async (queries: any[] = []) =>
        database.listRows({
          databaseId: DATABASE_ID,
          tableId: table.id,
          queries,
        }),
    }
  })

  return api
}
