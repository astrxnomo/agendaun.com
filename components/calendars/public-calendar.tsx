"use client"

import { setHours, setMinutes } from "date-fns"
import { useMemo, useState } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import { useCalendarPermissions } from "@/components/calendar/permissions"
import { SetupCalendar } from "@/components/calendar/setup-calendar"
import { type CalendarEvent } from "@/components/calendar/types"

// Eventos públicos - eventos abiertos a toda la comunidad universitaria (desde agosto 2025)
const publicEvents: CalendarEvent[] = [
  {
    id: "conferencia-inteligencia-artificial",
    title: "Conferencia: Inteligencia Artificial en la Educación",
    description:
      "Conferencia magistral sobre el impacto de la IA en el futuro de la educación superior. Abierta al público general.",
    start: setMinutes(setHours(new Date(2025, 7, 15), 16), 0), // 15 agosto 2025, 4:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 15), 18), 0), // 15 agosto 2025, 6:00 PM
    allDay: false,
    color: "blue",
    label: "Conferencia Pública",
    location: "Auditorio Principal",
  },
  {
    id: "feria-empleo-segundo-semestre",
    title: "Feria de Empleo - Segundo Semestre 2025",
    description:
      "Evento donde empresas tecnológicas y tradicionales ofrecen oportunidades laborales a estudiantes y egresados",
    start: setMinutes(setHours(new Date(2025, 7, 28), 9), 0), // 28 agosto 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 28), 17), 0), // 28 agosto 2025, 5:00 PM
    allDay: false,
    color: "emerald",
    label: "Feria de Empleo",
    location: "Plaza Central - Campus Principal",
  },
  {
    id: "semana-bienvenida-nuevos",
    title: "Semana de Bienvenida - Nuevos Estudiantes",
    description:
      "Actividades de integración y orientación para estudiantes de primer semestre",
    start: new Date(2025, 8, 2), // 2 septiembre 2025
    end: new Date(2025, 8, 6), // 6 septiembre 2025
    allDay: true,
    color: "violet",
    label: "Evento de Integración",
    location: "Todo el Campus",
  },
  {
    id: "festival-arte-cultura-segundo",
    title: "Festival de Arte y Cultura - Edición Otoño",
    description:
      "Segunda edición anual del festival que incluye exposiciones, conciertos, teatro y actividades culturales",
    start: new Date(2025, 8, 20), // 20 septiembre 2025
    end: new Date(2025, 8, 22), // 22 septiembre 2025
    allDay: true,
    color: "rose",
    label: "Festival Cultural",
    location: "Múltiples espacios del campus",
  },
  {
    id: "simposio-innovacion-educativa",
    title: "Simposio de Innovación Educativa",
    description:
      "Evento académico sobre nuevas metodologías de enseñanza y tecnologías educativas",
    start: setMinutes(setHours(new Date(2025, 9, 8), 14), 0), // 8 octubre 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 9, 8), 18), 0), // 8 octubre 2025, 6:00 PM
    allDay: false,
    color: "emerald",
    label: "Simposio Académico",
    location: "Centro de Convenciones Universitario",
  },
  {
    id: "graduacion-ceremonia-segundo",
    title: "Ceremonia de Graduación - Segundo Período 2025",
    description:
      "Ceremonia de grado para estudiantes de pregrado y posgrado del segundo período académico",
    start: setMinutes(setHours(new Date(2025, 10, 15), 10), 0), // 15 noviembre 2025, 10:00 AM
    end: setMinutes(setHours(new Date(2025, 10, 15), 13), 0), // 15 noviembre 2025, 1:00 PM
    allDay: false,
    color: "orange",
    label: "Ceremonia de Grado",
    location: "Coliseo Universitario",
  },
  {
    id: "semana-ciencia-tecnologia-2025",
    title: "Semana de la Ciencia y la Tecnología 2025",
    description:
      "Semana dedicada a la divulgación científica con talleres, experimentos y charlas para toda la familia",
    start: new Date(2025, 10, 25), // 25 noviembre 2025
    end: new Date(2025, 11, 1), // 1 diciembre 2025
    allDay: true,
    color: "blue",
    label: "Semana Científica",
    location: "Facultades de Ciencias",
  },
  {
    id: "foro-emprendimiento-fin-año",
    title: "Foro de Emprendimiento e Innovación - Cierre 2025",
    description:
      "Espacio para presentar ideas de negocio, startups universitarias y proyectos de emprendimiento del año",
    start: setMinutes(setHours(new Date(2025, 11, 10), 14), 0), // 10 diciembre 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 11, 10), 19), 0), // 10 diciembre 2025, 7:00 PM
    allDay: false,
    color: "violet",
    label: "Foro de Emprendimiento",
    location: "Centro de Innovación",
  },
  {
    id: "concierto-navidad-2025",
    title: "Concierto Navideño Universitario 2025",
    description:
      "Concierto de la orquesta y coros universitarios para celebrar la época navideña con la comunidad",
    start: setMinutes(setHours(new Date(2025, 11, 18), 19), 0), // 18 diciembre 2025, 7:00 PM
    end: setMinutes(setHours(new Date(2025, 11, 18), 21), 0), // 18 diciembre 2025, 9:00 PM
    allDay: false,
    color: "rose",
    label: "Concierto",
    location: "Teatro Universidad",
  },
  {
    id: "inicio-primer-semestre-2026",
    title: "Inicio del Primer Semestre 2026",
    description:
      "Actividades de bienvenida e inicio de clases para el primer semestre del año 2026",
    start: new Date(2026, 1, 2), // 2 febrero 2026
    end: new Date(2026, 1, 6), // 6 febrero 2026
    allDay: true,
    color: "emerald",
    label: "Inicio de Clases",
    location: "Campus Principal",
  },
]

interface PublicCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
}

export default function PublicCalendar({
  userRole = "user",
}: PublicCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(publicEvents)
  const { isColorVisible } = useCalendarContext()

  // Obtener permisos para calendario público
  const permissions = useCalendarPermissions("public", userRole)

  // Filtrar eventos basado en colores visibles
  const visibleEvents = useMemo(() => {
    return events.filter((event) => isColorVisible(event.color))
  }, [events, isColorVisible])

  const handleEventAdd = (event: CalendarEvent) => {
    if (permissions.canCreate) {
      setEvents([...events, event])
    }
  }

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    if (permissions.canEdit) {
      setEvents(
        events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      )
    }
  }

  const handleEventDelete = (eventId: string) => {
    if (permissions.canDelete) {
      setEvents(events.filter((event) => event.id !== eventId))
    }
  }

  return (
    <SetupCalendar
      events={visibleEvents}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      initialView="month"
      editable={permissions.canEdit}
      calendarType="public"
      permissions={permissions}
    />
  )
}
