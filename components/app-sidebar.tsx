"use client"

import {
  BookMarked,
  Building2,
  Bus,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock,
  FlaskConical,
  GraduationCap,
  Home,
  Landmark,
  LogIn,
  NotepadText,
  School,
  SquareUser,
  University,
} from "lucide-react"
import Link from "next/link"

import { NavUser } from "@/components/auth/nav-user"
import ConfigFilterButton from "@/components/config-filter-button"
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

import type { User } from "@/types/auth"
import type React from "react"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: User | null // Usuario desde SSR
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const handleFiltersChange = (filters: any) => {
    // Aquí puedes manejar los cambios de filtros
    // Por ejemplo, guardar en localStorage o enviar al servidor
    console.log("Filtros actualizados:", filters)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BookMarked size={18} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">AgendaUN</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuButton asChild tooltip="Inicio">
              <Link href="/">
                <Home />
                <span>Inicio</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild tooltip="Mi calendario">
              <Link href="/my-calendar">
                <Calendar />
                <span>Mi calendario</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Universidad</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuButton asChild tooltip="Agenda">
              <Link href="/calendar">
                <BookMarked />
                <span>Agenda</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
          <SidebarMenu>
            <Collapsible asChild defaultOpen={true}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Calendarios">
                  <Link href="/calendar">
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
                      <SidebarMenuSubButton asChild>
                        <Link href="/calendar/nacional">
                          <Landmark className="size-4" />
                          <span>Nacional</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/calendar/sede">
                          <School />
                          <span>Sede</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/calendar/facultad">
                          <University />
                          <span>Facultad</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/calendar/programa">
                          <GraduationCap />
                          <span>Programa</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <Collapsible asChild defaultOpen={true}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Horarios">
                  <Link href="/schedules">
                    <Clock />
                    <span>Horarios</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Expandir Horarios</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/schedules/offices">
                          <Building2 className="size-4" />
                          <span>Oficinas</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/schedules/library">
                          <BookMarked className="size-4" />
                          <span>Bibliotecas</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/schedules/professors">
                          <SquareUser className="size-4" />
                          <span>Profesores</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/schedules/tutoring">
                          <NotepadText className="size-4" />
                          <span>Monitorias</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/schedules/labs">
                          <FlaskConical className="size-4" />
                          <span>Laboratorios</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/schedules/transport">
                          <Bus className="size-4" />
                          <span>Transportes</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ConfigFilterButton
          variant="sidebar"
          user={user}
          onFiltersChange={handleFiltersChange}
        />
        <NavUser user={user} />
        {!user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Iniciar sesión" asChild>
                <Link href="/auth/login">
                  <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <LogIn className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Iniciar sesión</span>
                    <span className="text-muted-foreground truncate text-xs">
                      Accede con tu correo
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
