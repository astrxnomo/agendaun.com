import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

import { createAdminClient, createSessionClient } from "@/lib/appwrite"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")
  const secret = searchParams.get("secret")

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

  if (!userId || !secret) {
    return NextResponse.redirect(
      new URL("/auth/login?error=invalid_token", baseUrl),
    )
  }

  try {
    const cookieStore = await cookies()
    const existingSession = cookieStore.get("session")

    if (existingSession) {
      try {
        const { account: sessionAccount } = await createSessionClient(
          existingSession.value,
        )
        await sessionAccount.get()

        return NextResponse.redirect(new URL("/my-calendar", baseUrl))
      } catch {
        cookieStore.delete("session")
      }
    }

    const { account } = await createAdminClient()
    const session = await account.createSession(userId, secret)

    const response = NextResponse.redirect(new URL("/my-calendar", baseUrl))

    response.cookies.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expire),
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_DOMAIN
          : undefined,
    })

    return response
  } catch (error) {
    console.error("Auth callback error:", error)

    return NextResponse.redirect(
      new URL("/auth/login?error=auth_failed", baseUrl),
    )
  }
}
