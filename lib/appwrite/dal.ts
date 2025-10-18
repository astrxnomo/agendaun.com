"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

import { createSessionClient } from "./config"

export const verifySession = cache(async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session?.value) {
    redirect(
      "/status/error?title=Permiso denegado&description=No tienes permiso para acceder a esta página",
    )
  }

  return session.value
})

export const getUser = cache(async () => {
  const session = await verifySession()

  try {
    const { account } = await createSessionClient(session)
    const user = await account.get()
    return user
  } catch (error) {
    console.error("Error getting user:", error)
    redirect("/auth/login?message=Tu sesión ha expirado")
  }
})

export const hasValidSession = cache(async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")
  return !!session?.value
})
