"use server"
import { cookies } from "next/headers"
import { ID } from "node-appwrite"

import { createAdminClient, createSessionClient } from "@/lib/appwrite"
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

export async function login(userId: string, secret: string) {
  try {
    const { account } = await createAdminClient()

    const session = await account.createSession({
      userId,
      secret,
    })
    const cookieStore = await cookies()

    cookieStore.set("appwrite-session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

export async function logout(): Promise<void> {
  try {
    const client = await createSessionClient()

    if (client.account) {
      await client.account.deleteSession({ sessionId: "current" })
    }
  } catch (error) {
    console.error("Error deleting session:", error)
  }

  const cookieStore = await cookies()
  cookieStore.delete("appwrite-session")
}
