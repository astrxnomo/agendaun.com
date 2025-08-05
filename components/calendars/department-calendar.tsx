"use client"

import { setHours, setMinutes } from "date-fns"
import { useMemo, useState } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import { useCalendarPermissions } from "@/components/calendar/permissions"
import { SetupCalendar } from "@/components/calendar/setup-calendar"
import { type CalendarEvent } from "@/components/calendar/types"

// Eventos departamentales - eventos específicos del departamento académico (desde agosto 2025)
const departmentEvents: CalendarEvent[] = [
  {
    id: "reunion-docentes-agosto",
    title: "Reunión de Docentes - Agosto",
    description:
      "Reunión mensual del departamento para planificación del segundo semestre",
    start: setMinutes(setHours(new Date(2025, 7, 15), 14), 0), // 15 agosto 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 15), 16), 0), // 15 agosto 2025, 4:00 PM
    allDay: false,
    color: "blue",
    label: "Reunión Departamental",
    location: "Aula Magna - Edificio A",
  },
  {
    id: "capacitacion-metodologias-activas",
    title: "Capacitación en Metodologías Activas",
    description:
      "Taller de capacitación sobre metodologías activas de aprendizaje y evaluación formativa",
    start: setMinutes(setHours(new Date(2025, 7, 22), 9), 0), // 22 agosto 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 22), 12), 0), // 22 agosto 2025, 12:00 PM
    allDay: false,
    color: "emerald",
    label: "Capacitación",
    location: "Laboratorio de Informática 1",
  },
  {
    id: "evaluacion-curricular-segundo-semestre",
    title: "Evaluación Curricular - Segundo Semestre 2025",
    description: "Revisión y evaluación del currículo del segundo semestre",
    start: new Date(2025, 8, 5), // 5 septiembre 2025
    end: new Date(2025, 8, 7), // 7 septiembre 2025
    allDay: true,
    color: "violet",
    label: "Evaluación Académica",
  },
  {
    id: "reunion-docentes-septiembre",
    title: "Reunión de Docentes - Septiembre",
    description: "Reunión mensual del departamento para seguimiento académico",
    start: setMinutes(setHours(new Date(2025, 8, 15), 14), 0), // 15 septiembre 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 8, 15), 16), 0), // 15 septiembre 2025, 4:00 PM
    allDay: false,
    color: "blue",
    label: "Reunión Departamental",
    location: "Aula Magna - Edificio A",
  },
  {
    id: "semana-investigacion-segundo",
    title: "Semana de la Investigación - Segundo Período",
    description:
      "Semana dedicada a la presentación de proyectos de investigación en curso del departamento",
    start: new Date(2025, 9, 14), // 14 octubre 2025
    end: new Date(2025, 9, 18), // 18 octubre 2025
    allDay: true,
    color: "orange",
    label: "Evento Académico",
  },
  {
    id: "reunion-docentes-octubre",
    title: "Reunión de Docentes - Octubre",
    description:
      "Reunión mensual del departamento para evaluación de medio período",
    start: setMinutes(setHours(new Date(2025, 9, 15), 14), 0), // 15 octubre 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 9, 15), 16), 0), // 15 octubre 2025, 4:00 PM
    allDay: false,
    color: "blue",
    label: "Reunión Departamental",
    location: "Aula Magna - Edificio A",
  },
  {
    id: "congreso-educacion-superior",
    title: "Congreso Internacional de Educación Superior",
    description:
      "Participación en congreso internacional sobre innovación educativa y nuevas tendencias",
    start: new Date(2025, 10, 8), // 8 noviembre 2025
    end: new Date(2025, 10, 10), // 10 noviembre 2025
    allDay: true,
    color: "rose",
    label: "Congreso",
  },
  {
    id: "reunion-docentes-noviembre",
    title: "Reunión de Docentes - Noviembre",
    description:
      "Reunión mensual del departamento para preparación de exámenes finales",
    start: setMinutes(setHours(new Date(2025, 10, 15), 14), 0), // 15 noviembre 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 10, 15), 16), 0), // 15 noviembre 2025, 4:00 PM
    allDay: false,
    color: "blue",
    label: "Reunión Departamental",
    location: "Aula Magna - Edificio A",
  },
  {
    id: "feria-proyectos-fin-año",
    title: "Feria de Proyectos Estudiantiles - Fin de Año",
    description:
      "Exposición de proyectos finales de estudiantes del departamento correspondientes al segundo semestre",
    start: setMinutes(setHours(new Date(2025, 11, 12), 8), 0), // 12 diciembre 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 11, 12), 18), 0), // 12 diciembre 2025, 6:00 PM
    allDay: false,
    color: "orange",
    label: "Evento Estudiantil",
    location: "Plaza Central",
  },
  {
    id: "reunion-docentes-diciembre",
    title: "Reunión de Docentes - Diciembre",
    description:
      "Reunión de cierre del año académico y planificación del próximo período",
    start: setMinutes(setHours(new Date(2025, 11, 15), 14), 0), // 15 diciembre 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 11, 15), 16), 0), // 15 diciembre 2025, 4:00 PM
    allDay: false,
    color: "blue",
    label: "Reunión Departamental",
    location: "Aula Magna - Edificio A",
  },
]

interface DepartmentCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
  _departmentName?: string
}

export default function DepartmentCalendar({
  userRole = "user",
  _departmentName = "Departamento Académico",
}: DepartmentCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(departmentEvents)
  const { isColorVisible } = useCalendarContext()

  // Obtener permisos para calendario departamental
  const permissions = useCalendarPermissions("department", userRole)

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
      calendarType="department"
      permissions={permissions}
    />
  )
}
