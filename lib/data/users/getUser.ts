"use server"

import { redirect } from "next/navigation"

import { createSessionClient } from "@/lib/appwrite"

export async function getUser() {
  const client = await createSessionClient()

  if (!client.account) {
    redirect("/auth/login?message=Tu sesion ha expirado")
  }

  const user = await client.account.get()

  return user
}

export async function getOptionalUser() {
  const client = await createSessionClient()

  if (!client.account) {
    return null
  }

  try {
    const user = await client.account.get()
    return user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}
