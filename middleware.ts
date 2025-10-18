import { NextResponse } from "next/server"

import { hasValidSession } from "@/lib/appwrite/dal"

import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/auth")) {
    const hasSession = await hasValidSession()
    if (hasSession) {
      return NextResponse.redirect(new URL("/calendars/personal", request.url))
    }
    return NextResponse.next()
  }

  const isProtectedRoute =
    pathname.startsWith("/calendars") || pathname.startsWith("/schedules")

  if (isProtectedRoute) {
    const hasSession = await hasValidSession()

    if (!hasSession) {
      const loginUrl = new URL(
        "/auth/login?message=Debes iniciar sesión para acceder a esta página",
        request.url,
      )
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete("session")
      return response
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
