"use server"

import { sendMagicLink } from "@/lib/appwrite/auth"
import { loginSchema } from "@/lib/data/schemas"

export type sendLinkState = {
  success: boolean
  message: string
  errors?: {
    username?: string[]
    _form?: string[]
  }
  email?: string
}

export async function sendLink(
  prevState: sendLinkState,
  formData: FormData,
): Promise<sendLinkState> {
  try {
    const rawData = {
      username: formData.get("username") as string,
    }

    const validationResult = loginSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Error de validación",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const { username } = validationResult.data
    const email = `${username}@unal.edu.co`

    await sendMagicLink(email)

    return {
      success: true,
      message: "¡Enlace enviado! Revisa tu correo electrónico",
      email,
    }
  } catch (error) {
    console.error("Error sending magic link:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error enviando el enlace",
      errors: {
        _form: [error instanceof Error ? error.message : "Error desconocido"],
      },
    }
  }
}
