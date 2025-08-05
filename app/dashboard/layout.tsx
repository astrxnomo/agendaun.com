import { AppSidebar } from "@/components/app-sidebar"
import { CalendarProvider } from "@/components/calendar/calendar-context"
import NavSearch from "@/components/nav-top"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <NavSearch />
          <CalendarProvider>{children}</CalendarProvider>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
