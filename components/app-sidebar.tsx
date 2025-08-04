"use client"

import {
  Building2,
  Calendar,
  CalendarDays,
  Clock,
  GraduationCap,
  LifeBuoy,
  MapPin,
  Newspaper,
  Star,
  Theater,
  Trophy,
  Users,
} from "lucide-react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
          title: "Biblioteca",
          url: "/dashboard/services/library",
        },
        {
          title: "Cafeterías",
          url: "/dashboard/services/cafeterias",
        },
        {
          title: "Centros de Copiado",
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
    {
      title: "Noticias",
      url: "/dashboard/news",
      icon: Newspaper,
      items: [
        {
          title: "Últimas Noticias",
          url: "/dashboard/news",
        },
        {
          title: "Comunicados Oficiales",
          url: "/dashboard/news?type=official",
        },
        {
          title: "Eventos Destacados",
          url: "/dashboard/news?type=featured",
        },
        {
          title: "Convocatorias",
          url: "/dashboard/news?type=calls",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Mapa del Campus",
      url: "/campus-map",
      icon: MapPin,
    },
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
        <LoginForm />
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
