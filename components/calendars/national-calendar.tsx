"use client"

import { useMemo, useState } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import { useCalendarPermissions } from "@/components/calendar/permissions"
import { SetupCalendar } from "@/components/calendar/setup-calendar"
import { type CalendarEvent } from "@/components/calendar/types"

// Eventos nacionales de Colombia - eventos oficiales del país (desde agosto 2025)
const nationalEvents: CalendarEvent[] = [
  {
    id: "batalla-boyaca",
    title: "Batalla de Boyacá",
    description: "Conmemoración de la Batalla de Boyacá",
    start: new Date(2025, 7, 7), // 7 agosto 2025
    end: new Date(2025, 7, 7),
    allDay: true,
    color: "blue",
    label: "Festivo Nacional",
  },
  {
    id: "asuncion",
    title: "Asunción de la Virgen",
    description: "Festividad religiosa católica",
    start: new Date(2025, 7, 18), // 18 agosto 2025
    end: new Date(2025, 7, 18),
    allDay: true,
    color: "violet",
    label: "Festivo Nacional",
  },
  {
    id: "dia-raza",
    title: "Día de la Raza",
    description: "Conmemoración del encuentro de dos mundos",
    start: new Date(2025, 9, 13), // 13 octubre 2025
    end: new Date(2025, 9, 13),
    allDay: true,
    color: "orange",
    label: "Festivo Nacional",
  },
  {
    id: "todos-santos",
    title: "Día de Todos los Santos",
    description: "Festividad religiosa católica",
    start: new Date(2025, 10, 3), // 3 noviembre 2025
    end: new Date(2025, 10, 3),
    allDay: true,
    color: "violet",
    label: "Festivo Nacional",
  },
  {
    id: "independencia-cartagena",
    title: "Independencia de Cartagena",
    description: "Conmemoración de la independencia de Cartagena",
    start: new Date(2025, 10, 17), // 17 noviembre 2025
    end: new Date(2025, 10, 17),
    allDay: true,
    color: "blue",
    label: "Festivo Nacional",
  },
  {
    id: "inmaculada",
    title: "Inmaculada Concepción",
    description: "Festividad religiosa católica",
    start: new Date(2025, 11, 8), // 8 diciembre 2025
    end: new Date(2025, 11, 8),
    allDay: true,
    color: "violet",
    label: "Festivo Nacional",
  },
  {
    id: "navidad",
    title: "Navidad",
    description: "Celebración del nacimiento de Jesucristo",
    start: new Date(2025, 11, 25), // 25 diciembre 2025
    end: new Date(2025, 11, 25),
    allDay: true,
    color: "rose",
    label: "Festivo Nacional",
  },
  {
    id: "new-year-2026",
    title: "Año Nuevo 2026",
    description: "Celebración del inicio del nuevo año",
    start: new Date(2026, 0, 1), // 1 enero 2026
    end: new Date(2026, 0, 1),
    allDay: true,
    color: "blue",
    label: "Festivo Nacional",
  },
  {
    id: "reyes-magos-2026",
    title: "Día de los Reyes Magos",
    description: "Festividad religiosa tradicional",
    start: new Date(2026, 0, 6), // 6 enero 2026
    end: new Date(2026, 0, 6),
    allDay: true,
    color: "violet",
    label: "Festivo Nacional",
  },
  {
    id: "san-jose-2026",
    title: "Día de San José",
    description: "Festividad religiosa católica",
    start: new Date(2026, 2, 23), // 23 marzo 2026 (trasladado al lunes)
    end: new Date(2026, 2, 23),
    allDay: true,
    color: "violet",
    label: "Festivo Nacional",
  },
]

interface NationalCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
}

export default function NationalCalendar({
  userRole = "user",
}: NationalCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(nationalEvents)
  const { isColorVisible } = useCalendarContext()

  // Obtener permisos para calendario nacional
  const permissions = useCalendarPermissions("national", userRole)

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
      calendarType="national"
      permissions={permissions}
    />
  )
}
