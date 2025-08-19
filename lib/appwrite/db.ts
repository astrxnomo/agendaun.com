import { ID } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite/config"

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!

const collections = [
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

  collections.forEach((collection) => {
    api[collection.name] = {
      create: async (
        payload: any,
        permissions: string[] = [],
        id: string = ID.unique(),
      ) =>
        database.createDocument(
          DATABASE_ID,
          collection.id,
          id,
          payload,
          permissions,
        ),
      update: async (id: string, payload: any, permissions?: string[]) =>
        permissions
          ? database.updateDocument(
              DATABASE_ID,
              collection.id,
              id,
              payload,
              permissions,
            )
          : database.updateDocument(DATABASE_ID, collection.id, id, payload),
      delete: async (id: string) =>
        database.deleteDocument(DATABASE_ID, collection.id, id),
      get: async (id: string) =>
        database.getDocument(DATABASE_ID, collection.id, id),
      list: async (queries: any[] = []) =>
        database.listDocuments(DATABASE_ID, collection.id, queries),
    }
  })

  return api
}
