import { type NextRequest, NextResponse } from "next/server"

import { createSession } from "@/lib/appwrite/auth"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")
  const secret = searchParams.get("secret")

  if (!userId || !secret) {
    return NextResponse.redirect(
      new URL(
        "/auth/login?message=El enlace de verificación no es válido&type=error",
        request.url,
      ),
    )
  }

  try {
    await createSession(userId, secret)

    return NextResponse.redirect(new URL("/calendars/personal", request.url))
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.redirect(
      new URL(
        "/auth/login?message=El enlace puede haber expirado. Por favor, solicita uno nuevo&type=error",
        request.url,
      ),
    )
  }
}
