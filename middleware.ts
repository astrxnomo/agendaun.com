import { NextResponse } from "next/server"

import { getUser, hasValidSession } from "@/lib/appwrite/auth"

import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth")) {
    const hasSession = await hasValidSession()
    if (hasSession) {
      const user = await getUser()
      if (user) {
        return NextResponse.redirect(
          new URL("/calendars/my-calendar", request.url),
        )
      }
    }
    return NextResponse.next()
  }

  const isProtectedRoute =
    pathname.startsWith("/calendars") || pathname.startsWith("/admin")

  if (isProtectedRoute) {
    const hasSession = await hasValidSession()
    if (!hasSession) {
      const response = NextResponse.redirect(
        new URL("/auth/unauthorized", request.url),
      )
      response.cookies.delete("session")
      return response
    }

    const user = await getUser()
    if (!user) {
      const response = NextResponse.redirect(
        new URL("/auth/unauthorized", request.url),
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
