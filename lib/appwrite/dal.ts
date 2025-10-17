"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

import { createSessionClient } from "./config"

export const verifySession = cache(async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session?.value) {
    redirect("/auth/unauthorized/require-auth")
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
    redirect("/auth/unauthorized/require-auth")
  }
})

export const hasValidSession = cache(async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")
  return !!session?.value
})
