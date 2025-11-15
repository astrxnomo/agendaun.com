import { Outfit } from "next/font/google"

import { ConfigBanner } from "@/components/auth/config-banner"
import { CalendarProvider } from "@/components/calendar/core/calendar-context"
import { AppSidebar } from "@/components/layout/app-sidebar"
import NavTop from "@/components/layout/nav-top"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { AuthContextProvider } from "@/contexts/auth-context"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"

import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})
export const metadata: Metadata = {
  title: "AgendaUN",
  description: "Agenda de la Universidad Nacional de Colombia",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthContextProvider>
            <CalendarProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <NavTop />
                  {children}
                  <Analytics />
                  <SpeedInsights />
                </SidebarInset>
              </SidebarProvider>
            </CalendarProvider>
            <Toaster richColors />
            <ConfigBanner />
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
