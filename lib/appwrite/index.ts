"use server"

import { cookies } from "next/headers"
import { Account, Client, Storage, TablesDB, Users } from "node-appwrite"

export const createSessionClient = async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get("appwrite-session")

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setLocale("es-co")

  if (session?.value) {
    client.setSession(session.value)
  }

  return {
    ...(session?.value && { account: new Account(client) }),
    database: new TablesDB(client),
    storage: new Storage(client),
  }
}

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!)
    .setLocale("es-co")

  return {
    account: new Account(client),
    database: new TablesDB(client),
    users: new Users(client),
    storage: new Storage(client),
  }
}
