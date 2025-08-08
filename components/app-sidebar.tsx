"use client"

import {
  BookMarked,
  Building2,
  Bus,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock,
  Flag,
  FlaskConical,
  GraduationCap,
  Home,
  MapPinHouse,
  MapPinned,
  NotepadText,
  Palette,
  Presentation,
  School,
  SquareUser,
  Star,
  Trophy,
  Users,
} from "lucide-react"
import Link from "next/link"

import ConfigFilterButton from "@/components/config-filter-button"
import { LoginForm } from "@/components/login-form"
import { NavUser } from "@/components/nav-user"
import ThemeToggle from "@/components/theme-toggle"
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

const data = {
  user: {
    name: "Usuario",
    email: "estudiante@unal.edu.co",
    avatar: "/avatars/user.jpg",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">HorarioU</span>
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
            <SidebarMenuButton asChild tooltip="Mis favoritos">
              <Link href="/events">
                <Star />
                <span>Mis favoritos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Universidad</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible asChild>
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
                        <Link href="/calendar/national">
                          <Flag className="size-4" />
                          <span>Nacional</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/calendar/sede">
                          <MapPinHouse />
                          <span>Sede</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/calendar/facultad">
                          <School />
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
                        <Link href="/services/library">
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

            <Collapsible asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Eventos">
                  <Link href="/events">
                    <MapPinned />
                    <span>Eventos</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Expandir Eventos</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/events?type=academic">
                          <GraduationCap className="size-4" />
                          <span>Académicos</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/events?type=cultural">
                          <Palette className="size-4" />
                          <span>Culturales</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/events?type=sports">
                          <Trophy className="size-4" />
                          <span>Deportivos</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/events?type=conferences">
                          <Presentation className="size-4" />
                          <span>Conferencias</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/events?type=workshops">
                          <Users className="size-4" />
                          <span>Talleres</span>
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
        <NavUser user={data.user} />
        <ConfigFilterButton variant="sidebar" />
        <LoginForm />
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
