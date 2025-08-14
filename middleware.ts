// middleware.ts
import { NextResponse } from "next/server"

import { createSessionClient } from "@/lib/appwrite"

import type { NextRequest } from "next/server"

const protectedRoutes = ["/profile", "/settings", "/calendars/my-calendar"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("session")?.value

  if (pathname.startsWith("/auth")) {
    if (sessionCookie) {
      try {
        const { account } = await createSessionClient(sessionCookie)
        await account.get()
        return NextResponse.redirect(
          new URL("/calendars/my-calendar", request.url),
        )
      } catch {}
    }
    return NextResponse.next()
  }

  const isProtectedRoute =
    pathname.startsWith("/calendars") || protectedRoutes.includes(pathname)

  if (isProtectedRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url))
    }
    try {
      const { account } = await createSessionClient(sessionCookie)
      await account.get()
      return NextResponse.next()
    } catch {
      const response = NextResponse.redirect(
        new URL("/auth/unauthorized", request.url),
      )
      response.cookies.delete("session")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
