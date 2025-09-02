import { ID } from "node-appwrite"

import { createAdminClient } from "@/lib/appwrite/config"

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!

// Using new terminology but keeping compatibility with current API
const tables = [
  { name: "events", id: process.env.NEXT_PUBLIC_COLLECTION_EVENTS! },
  { name: "calendars", id: process.env.NEXT_PUBLIC_COLLECTION_CALENDARS! },
  { name: "etiquettes", id: process.env.NEXT_PUBLIC_COLLECTION_ETIQUETTES! },
  { name: "sedes", id: process.env.NEXT_PUBLIC_COLLECTION_SEDES! },
  { name: "faculties", id: process.env.NEXT_PUBLIC_COLLECTION_FACULTIES! },
  { name: "programs", id: process.env.NEXT_PUBLIC_COLLECTION_PROGRAMS! },
  { name: "profiles", id: process.env.NEXT_PUBLIC_COLLECTION_PROFILES! },
]

export async function dbAdmin() {
  const { database } = await createAdminClient()
  const api: Record<string, any> = {}

  tables.forEach((table) => {
    api[table.name] = {
      // New naming convention that maps to old methods for now
      createRow: async (
        data: any,
        permissions: string[] = [],
        rowId: string = ID.unique(),
      ) =>
        database.createDocument(
          DATABASE_ID,
          table.id,
          rowId,
          data,
          permissions,
        ),
      updateRow: async (rowId: string, data: any, permissions?: string[]) =>
        permissions
          ? database.updateDocument(
              DATABASE_ID,
              table.id,
              rowId,
              data,
              permissions,
            )
          : database.updateDocument(DATABASE_ID, table.id, rowId, data),
      deleteRow: async (rowId: string) =>
        database.deleteDocument(DATABASE_ID, table.id, rowId),
      getRow: async (rowId: string) =>
        database.getDocument(DATABASE_ID, table.id, rowId),
      listRows: async (queries: any[] = []) =>
        database.listDocuments(DATABASE_ID, table.id, queries),

      // Keep old methods for backward compatibility
      create: async (
        payload: any,
        permissions: string[] = [],
        id: string = ID.unique(),
      ) =>
        database.createDocument(
          DATABASE_ID,
          table.id,
          id,
          payload,
          permissions,
        ),
      update: async (id: string, payload: any, permissions?: string[]) =>
        permissions
          ? database.updateDocument(
              DATABASE_ID,
              table.id,
              id,
              payload,
              permissions,
            )
          : database.updateDocument(DATABASE_ID, table.id, id, payload),
      delete: async (id: string) =>
        database.deleteDocument(DATABASE_ID, table.id, id),
      get: async (id: string) =>
        database.getDocument(DATABASE_ID, table.id, id),
      list: async (queries: any[] = []) =>
        database.listDocuments(DATABASE_ID, table.id, queries),
    }
  })

  return api
}
