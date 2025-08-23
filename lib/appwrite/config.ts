"use server"

import { Account, Client, Databases, Teams, Users } from "node-appwrite"

import { verifySession } from "@/lib/appwrite/auth"

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!)
    .setLocale("es-co")

  return {
    get account() {
      return new Account(client)
    },

    get database() {
      return new Databases(client)
    },

    get teams() {
      return new Teams(client)
    },
    get users() {
      return new Users(client)
    },
  }
}

export const createSessionClient = async () => {
  const sessionValue = await verifySession()

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setLocale("es-co")
    .setSession(sessionValue)

  return {
    get account() {
      return new Account(client)
    },

    get database() {
      return new Databases(client)
    },

    get teams() {
      return new Teams(client)
    },

    get users() {
      return new Users(client)
    },
  }
}
