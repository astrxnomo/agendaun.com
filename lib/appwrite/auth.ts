"use server"

import { cookies } from "next/headers"
import { ID } from "node-appwrite"

import { createAdminClient, createSessionClient } from "@/lib/appwrite/config"
import { handleError } from "@/lib/utils/error-handler"

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
    return handleError(error)
  }
}

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

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (session?.value) {
    try {
      const { account } = await createSessionClient(session.value)
      await account.deleteSession({ sessionId: "current" })
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  cookieStore.delete("session")
}

export async function getUserForContext() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session?.value) {
      return null
    }

    const { account } = await createSessionClient(session.value)
    const user = await account.get()
    return user
  } catch (error) {
    console.error("Error getting user for context:", error)
    return null
  }
}
