"use client"

import {
  BookOpen,
  Calendar,
  CalendarDays,
  CheckSquare,
  Clock,
  GraduationCap,
  LifeBuoy,
  Settings2,
  User,
  Users,
} from "lucide-react"
import * as React from "react"
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
          title: "Agenda",
          url: "/dashboard/calendar?view=agenda",
        },
      ],
    },
    {
      title: "Horarios",
      url: "/dashboard/schedules",
      icon: Clock,
      items: [
        {
          title: "Mis Horarios",
          url: "/dashboard/schedules",
        },
        {
          title: "Crear Horario",
          url: "/dashboard/schedules/create",
        },
        {
          title: "Horarios Guardados",
          url: "/dashboard/schedules/saved",
        },
      ],
    },
    {
      title: "Materias",
      url: "/dashboard/subjects",
      icon: BookOpen,
      items: [
        {
          title: "Mis Materias",
          url: "/dashboard/subjects",
        },
        {
          title: "Agregar Materia",
          url: "/dashboard/subjects/add",
        },
        {
          title: "Profesores",
          url: "/dashboard/subjects/professors",
        },
        {
          title: "Aulas",
          url: "/dashboard/subjects/classrooms",
        },
      ],
    },
    {
      title: "Tareas",
      url: "/dashboard/tasks",
      icon: CheckSquare,
      items: [
        {
          title: "Pendientes",
          url: "/dashboard/tasks?status=pending",
        },
        {
          title: "Completadas",
          url: "/dashboard/tasks?status=completed",
        },
        {
          title: "Vencidas",
          url: "/dashboard/tasks?status=overdue",
        },
        {
          title: "Nueva Tarea",
          url: "/dashboard/tasks/create",
        },
      ],
    },
    {
      title: "Configuración",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Perfil",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Notificaciones",
          url: "/dashboard/settings/notifications",
        },
        {
          title: "Preferencias",
          url: "/dashboard/settings/preferences",
        },
        {
          title: "Universidad",
          url: "/dashboard/settings/university",
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
      name: "Semestre Actual",
      url: "/dashboard/semesters/current",
      icon: GraduationCap,
    },
    {
      name: "Exámenes",
      url: "/dashboard/exams",
      icon: CalendarDays,
    },
    {
      name: "Mi Progreso",
      url: "/dashboard/progress",
      icon: User,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
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
