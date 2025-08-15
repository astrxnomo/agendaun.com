import { Outfit } from "next/font/google"

import { AppSidebar } from "@/components/app-sidebar"
import { CalendarProvider } from "@/components/calendar/calendar-context"
import NavTop from "@/components/nav-top"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { getUser } from "@/lib/auth"

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
  const user = await getUser()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CalendarProvider>
            <SidebarProvider>
              <AppSidebar user={user} />
              <SidebarInset>
                <NavTop user={user} />
                {children}
              </SidebarInset>
            </SidebarProvider>
          </CalendarProvider>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
