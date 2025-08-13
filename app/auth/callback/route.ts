import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

import { createAdminClient, createSessionClient } from "@/lib/appwrite"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")
  const secret = searchParams.get("secret")
  const from = searchParams.get("from")

  // Si no hay parámetros, redirigir al login con error
  if (!userId || !secret) {
    const loginUrl = new URL(
      "/login",
      process.env.NEXT_PUBLIC_SITE_URL || request.url,
    )
    loginUrl.searchParams.set("error", "invalid_token")
    return NextResponse.redirect(loginUrl)
  }

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

        // Redirigir a la página solicitada o al inicio
        const redirectUrl = from ? decodeURIComponent(from) : "/"
        const finalUrl = new URL(
          redirectUrl,
          process.env.NEXT_PUBLIC_SITE_URL || request.url,
        )
        return NextResponse.redirect(finalUrl)
      } catch {
        // La sesión existente no es válida, continuar con la nueva
        cookieStore.delete("session")
      }
    }

    // Crear nueva sesión con el token del magic link
    const { account } = await createAdminClient()
    const session = await account.createSession(userId, secret)

    // Crear la respuesta de redirección
    const redirectUrl = from ? decodeURIComponent(from) : "/"
    const finalUrl = new URL(
      redirectUrl,
      process.env.NEXT_PUBLIC_SITE_URL || request.url,
    )
    const response = NextResponse.redirect(finalUrl)

    // Establecer la cookie de sesión en la respuesta
    response.cookies.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expire),
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Auth callback error:", error)

    // Redirigir al login con error
    const loginUrl = new URL(
      "/auth/login",
      process.env.NEXT_PUBLIC_SITE_URL || request.url,
    )
    loginUrl.searchParams.set("error", "auth_failed")
    return NextResponse.redirect(loginUrl)
  }
}
