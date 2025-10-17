import { NextResponse } from "next/server"

import { hasValidSession } from "@/lib/appwrite/dal"

import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si está intentando acceder a /auth y ya tiene sesión, redirigir a calendars
  if (pathname.startsWith("/auth")) {
    const hasSession = await hasValidSession()
    if (hasSession) {
      return NextResponse.redirect(new URL("/calendars/personal", request.url))
    }
    return NextResponse.next()
  }

  // Rutas protegidas que requieren autenticación
  const isProtectedRoute =
    pathname.startsWith("/calendars") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/schedules")

  if (isProtectedRoute) {
    const hasSession = await hasValidSession()

    if (!hasSession) {
      const response = NextResponse.redirect(
        new URL("/auth/unauthorized/require-auth", request.url),
      )
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
