"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ID } from "node-appwrite"

import { createAdminClient, createSessionClient } from "./appwrite"

import type { User } from "@/types/auth"

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  try {
    const { account } = await createSessionClient(sessionCookie?.value ?? "")
    return (await account.get()) as User
  } catch {
    return null
  }
}

export async function sendMagicLink(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const data = Object.fromEntries(formData)
  const email = data.email as string

  if (!email || typeof email !== "string") {
    return { success: false, error: "invalid_email" }
  }

  const { account } = await createAdminClient()

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const callbackUrl = `${baseUrl}/auth/callback`

    await account.createMagicURLToken(ID.unique(), email, callbackUrl)
    return { success: true }
  } catch (error) {
    console.error("Error sending magic link:", error)
    return { success: false, error: "send_failed" }
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  try {
    const { account } = await createSessionClient(sessionCookie?.value ?? "")
    await account.deleteSession("current")
  } catch (error) {
    console.error("Error deleting session:", error)
  }

  cookieStore.delete("session")
  redirect("/")
}
