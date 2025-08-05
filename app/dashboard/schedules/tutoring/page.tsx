"use client"

import {
  TutoringCalendarAdapter,
  TutoringListAdapter,
  TutoringStatsAdapter,
} from "@/components/calendar/adapters/tutoring-adapters"
import { SchedulePageLayout } from "@/components/schedule-page-layout"

export default function TutoringPage() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Horarios", href: "/dashboard/schedules" },
    { label: "Monitorías", isCurrentPage: true },
  ]

  return (
    <SchedulePageLayout
      title="Monitorías Académicas"
      description="Encuentra apoyo académico personalizado con nuestros monitores especializados"
      breadcrumbs={breadcrumbs}
      events={[]} // Los eventos se generan internamente por los adaptadores
      // 🎯 Usar los adaptadores optimizados para monitorías
      calendarComponent={TutoringCalendarAdapter}
      listComponent={TutoringListAdapter}
      statsComponent={TutoringStatsAdapter}
      // 🎯 Los filtros PRINCIPALES son Sede/Facultad/Programa (filters-dialog)
      // Estos son filtros secundarios/adicionales específicos de monitorías
      filterOptions={{
        eventTypes: ["tutoring"],
        instructors: [
          "Andrea Pérez",
          "Carlos Rodríguez",
          "María González",
          "Ana López",
          "David Martínez",
          "Laura Fernández",
          "Roberto Silva",
        ],
        locations: [
          "Edificio Matemáticas",
          "Edificio Física",
          "Edificio Ingeniería de Sistemas",
          "Edificio Química",
          "Edificio Estadística",
        ],
        tags: [
          "monitoría",
          "estudio",
          "apoyo académico",
          "basic",
          "intermediate",
          "advanced",
          "group",
          "individual",
          "matemáticas",
          "física",
          "programación",
          "química",
        ],
      }}
    />
  )
}
