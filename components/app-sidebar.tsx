"use client"

import {
  Building2,
  Bus,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock,
  Coffee,
  FlaskConical,
  GraduationCap,
  Heart,
  Home,
  Library,
  LifeBuoy,
  NotepadText,
  Palette,
  Presentation,
  SquareUser,
  Star,
  Theater,
  Trophy,
  Users,
} from "lucide-react"
import Link from "next/link"

import { NavUser } from "@/components/nav-user"
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

import { LoginForm } from "./login-form"
import ThemeToggle from "./theme-toggle"

const data = {
  user: {
    name: "Usuario",
    email: "estudiante@unal.edu.co",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Calendario",
      url: "/dashboard/calendar",
      icon: Calendar,
      isActive: true,
      items: [
        {
          title: "Vista Mensual",
          url: "/dashboard/calendar?view=month",
        },
        {
          title: "Vista Semanal",
          url: "/dashboard/calendar?view=week",
        },
        {
          title: "Vista Diaria",
          url: "/dashboard/calendar?view=day",
        },
        {
          title: "Agenda Personal",
          url: "/dashboard/calendar?view=agenda",
        },
      ],
    },
    {
      title: "Eventos Universitarios",
      url: "/dashboard/events",
      icon: CalendarDays,
      items: [
        {
          title: "Todos los Eventos",
          url: "/dashboard/events",
        },
        {
          title: "Eventos Culturales",
          url: "/dashboard/events?type=cultural",
        },
        {
          title: "Conferencias",
          url: "/dashboard/events?type=conferences",
        },
        {
          title: "Deportes",
          url: "/dashboard/events?type=sports",
        },
        {
          title: "Talleres",
          url: "/dashboard/events?type=workshops",
        },
        {
          title: "Ferias y Expo",
          url: "/dashboard/events?type=fairs",
        },
      ],
    },
    {
      title: "Horarios Académicos",
      url: "/dashboard/schedules",
      icon: Clock,
      items: [
        {
          title: "Tutorías",
          url: "/dashboard/schedules/tutoring",
        },
        {
          title: "Oficinas",
          url: "/dashboard/schedules/offices",
        },
        {
          title: "Laboratorios",
          url: "/dashboard/schedules/labs",
        },
        {
          title: "Profesores",
          url: "/dashboard/schedules/professors",
        },
      ],
    },
    {
      title: "Servicios Universitarios",
      url: "/dashboard/services",
      icon: Building2,
      items: [
        {
          title: "Bibliotecas",
          url: "/dashboard/services/library",
        },
        {
          title: "Cafeterías",
          url: "/dashboard/services/cafeterias",
        },
        {
          title: "Papelerías",
          url: "/dashboard/services/printing",
        },
        {
          title: "Transporte",
          url: "/dashboard/services/transport",
        },
        {
          title: "Bienestar Estudiantil",
          url: "/dashboard/services/wellness",
        },
        {
          title: "Servicios Médicos",
          url: "/dashboard/services/medical",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Soporte",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Comunidad",
      url: "/community",
      icon: Users,
    },
  ],
  projects: [
    {
      name: "Eventos Favoritos",
      url: "/dashboard/favorites",
      icon: Star,
    },
    {
      name: "Grupos de Estudio",
      url: "/dashboard/study-groups",
      icon: Users,
    },
    {
      name: "Deportes y Recreación",
      url: "/dashboard/sports",
      icon: Trophy,
    },
    {
      name: "Arte y Cultura",
      url: "/dashboard/culture",
      icon: Theater,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">HorarioU</span>
                  <span className="truncate text-xs">Universidad</span>
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
              <Link href="/dashboard">
                <Home />
                <span>Inicio</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild tooltip="Mi horario">
              <Link href="/dashboard/calendar">
                <Calendar />
                <span>Mi horario</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild tooltip="Mis favoritos">
              <Link href="/dashboard/events">
                <Star />
                <span>Mis favoritos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Universidad</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible asChild defaultOpen={true}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Horarios Académicos">
                  <Link href="/dashboard/schedules">
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
                        <Link href="/dashboard/schedules/professors">
                          <SquareUser className="size-4" />
                          <span>Profesores</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/schedules/offices">
                          <Building2 className="size-4" />
                          <span>Oficinas</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/schedules/faculties">
                          <GraduationCap className="size-4" />
                          <span>Facultades</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/schedules/tutoring">
                          <NotepadText className="size-4" />
                          <span>Monitorias</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/schedules/labs">
                          <FlaskConical className="size-4" />
                          <span>Laboratorios</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Eventos Universitarios">
                  <Link href="/dashboard/events">
                    <CalendarDays />
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
                        <Link href="/dashboard/events?type=academic">
                          <GraduationCap className="size-4" />
                          <span>Académicos</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/events?type=cultural">
                          <Palette className="size-4" />
                          <span>Culturales</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/events">
                          <Trophy className="size-4" />
                          <span>Deportivos</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/events?type=conferences">
                          <Presentation className="size-4" />
                          <span>Conferencias</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/events?type=workshops">
                          <Users className="size-4" />
                          <span>Talleres</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Servicios Universitarios">
                  <Link href="/dashboard/services">
                    <Building2 />
                    <span>Servicios</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Expandir Servicios</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/services/library">
                          <Library className="size-4" />
                          <span>Bibliotecas</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/services/cafeterias">
                          <Coffee className="size-4" />
                          <span>Cafeterías</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/services/wellness">
                          <Heart className="size-4" />
                          <span>Bienestar</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/dashboard/services/transport">
                          <Bus className="size-4" />
                          <span>Transporte</span>
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
        <LoginForm />
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
