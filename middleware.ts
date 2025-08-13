import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

// Rutas que requieren autenticación (pero se manejan en el componente)
const protectedRoutes = ["/my-calendar", "/profile", "/settings"]

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/", "/calendar", "/schedules", "/login", "/auth"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir todas las rutas - la autenticación se maneja en los componentes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
