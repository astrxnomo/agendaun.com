"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { type User } from "@/types/auth"

import { createAdminClient, createSessionClient } from "./appwrite"

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
  const from = data.from as string

  if (!email || typeof email !== "string") {
    return { success: false, error: "invalid_email" }
  }

  const { account } = await createAdminClient()

  try {
    await account.createMagicURLToken(
      "unique()",
      email,
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback${from ? `?from=${encodeURIComponent(from)}` : ""}`,
    )
    return { success: true }
  } catch (error) {
    console.error("Error sending magic link:", error)
    return { success: false, error: "send_failed" }
  }
}

export async function createSessionFromToken(
  userId: string,
  secret: string,
): Promise<boolean> {
  const { account } = await createAdminClient()

  try {
    // Verificar si ya existe una sesión activa
    const cookieStore = await cookies()
    const existingSession = cookieStore.get("session")

    if (existingSession) {
      try {
        const { account: sessionAccount } = await createSessionClient(
          existingSession.value,
        )
        await sessionAccount.get() // Si esto funciona, ya hay una sesión válida
        return true
      } catch {
        // La sesión existente no es válida, continuar con la nueva
        cookieStore.delete("session")
      }
    }

    // Crear nueva sesión con el token del magic link
    const session = await account.createSession(userId, secret)

    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expire),
      path: "/",
    })

    return true
  } catch (error) {
    console.error("Error creating session from token:", error)
    return false
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
  redirect("/auth/login")
}
