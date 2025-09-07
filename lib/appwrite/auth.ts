"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Account, Client, ID } from "node-appwrite"
import { cache } from "react"

import { createAdminClient, createSessionClient } from "@/lib/appwrite/config"
import { handleAppwriteError } from "@/lib/utils/error-handler"

export async function sendMagicLink(email: string) {
  try {
    if (!email || typeof email !== "string") {
      throw new Error("Email es requerido")
    }

    const { account } = await createAdminClient()

    await account.createMagicURLToken({
      userId: ID.unique(),
      email,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`,
    })
  } catch (error) {
    console.error("Error sending magic link:", error)
    return handleAppwriteError(error)
  }
}

export const verifySession = cache(async () => {
  const session = (await cookies()).get("session")

  if (!session?.value) {
    redirect("/auth/unauthorized")
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setLocale("es-co")
    .setSession(session.value)

  const account = new Account(client)

  try {
    await account.get()
    return session.value
  } catch (error) {
    console.error("Invalid session:", error)
    redirect("/auth/unauthorized")
  }
})

export async function createSession(userId: string, secret: string) {
  const { account } = await createAdminClient()
  const session = await account.createSession({
    userId,
    secret,
  })
  const cookieStore = await cookies()

  cookieStore.set("session", session.secret, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: new Date(session.expire),
    path: "/",
  })
}

export const getUser = cache(async () => {
  try {
    const { account } = await createSessionClient()
    return await account.get()
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
})

export const hasValidSession = cache(async () => {
  const session = (await cookies()).get("session")
  return !!session?.value
})

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()

  try {
    const { account } = await createSessionClient()
    await account.deleteSession({ sessionId: "current" })
  } catch (error) {
    console.error("Error deleting session:", error)
  }
  cookieStore.delete("session")
}
