"use client"

import {
  BookMarked,
  Calendar,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  Home,
  Landmark,
  LifeBuoy,
  LogIn,
  School,
  Send,
  University,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavUser } from "@/components/auth/nav-user"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthContext } from "@/contexts/auth-context"

import { Badge } from "../ui/badge"
import { SchedulesSidebar } from "./schedules-sidebar"

export function AppSidebar() {
  const { user, isLoading } = useAuthContext()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BookMarked size={18} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="flex items-center gap-2 truncate font-medium">
                    AgendaUN
                    <Badge className="h-5">Beta</Badge>
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuButton
              asChild
              tooltip="Inicio"
              isActive={isActive("/") && pathname === "/"}
            >
              <Link href="/">
                <Home />
                <span>Inicio</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              tooltip="Mi calendario"
              isActive={isActive("/calendars/personal")}
            >
              <Link href="/calendars/personal">
                <Calendar />
                <span>Mi calendario</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Universidad</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuButton
              asChild
              tooltip="Agenda"
              isActive={isActive("/calendars")}
            >
              <Link href="/calendars">
                <BookMarked />
                <span>Agenda</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
          <SidebarMenu>
            <Collapsible asChild defaultOpen={true}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Calendarios"
                  isActive={isActive("/calendars")}
                >
                  <Link href="/calendars">
                    <CalendarDays />
                    <span>Calendarios</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Expandir Calendarios</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive("/calendars/national")}
                      >
                        <Link href="/calendars/national">
                          <Landmark className="size-4" />
                          <span>Nacional</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive("/calendars/sede")}
                      >
                        <Link href="/calendars/sede">
                          <School />
                          <span>Sede</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive("/calendars/faculty")}
                      >
                        <Link href="/calendars/faculty">
                          <University />
                          <span>Facultad</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive("/calendars/program")}
                      >
                        <Link href="/calendars/program">
                          <GraduationCap />
                          <span>Programa</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <SchedulesSidebar />
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Ayuda</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuButton asChild tooltip="Soporte">
              <Link href="">
                <LifeBuoy />
                <span>Soporte</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuButton asChild tooltip="Feedback">
              <Link href="">
                <Send />
                <span>Feedback</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {isLoading ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" disabled>
                <Skeleton className="flex aspect-square size-8 rounded-lg" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-3 w-32" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <>
            {user ? (
              <NavUser />
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" tooltip="Iniciar sesión" asChild>
                    <Link href="/auth/login">
                      <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <LogIn className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          Iniciar sesión
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          Accede con tu correo
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
