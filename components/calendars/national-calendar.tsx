"use client"

import { useCallback, useMemo, useState } from "react"

import { LabelsHeader } from "@/components/calendar/labels-header"
import { useCalendarPermissions } from "@/components/calendar/permissions"
import { SetupCalendar } from "@/components/calendar/setup-calendar"
import {
  type CalendarEvent,
  type Etiquette,
  type EventColor,
} from "@/components/calendar/types"

// Eventos nacionales de Colombia - eventos oficiales del país (desde agosto 2025)
const nationalEvents: CalendarEvent[] = [
  {
    id: "regreso-clases-agosto",
    title: "Inicio de Clases Segundo Semestre",
    description: "Inicio del período académico 2025-2",
    start: new Date(2025, 7, 1), // 1 agosto 2025
    end: new Date(2025, 7, 1),
    allDay: true,
    color: "green",
  },
  {
    id: "jornada-vacunacion-agosto",
    title: "Jornada Nacional de Vacunación",
    description: "Campaña nacional de vacunación estudiantil",
    start: new Date(2025, 7, 5), // 5 agosto 2025
    end: new Date(2025, 7, 5),
    allDay: true,
    color: "red",
  },
  {
    id: "batalla-boyaca",
    title: "Batalla de Boyacá",
    description: "Conmemoración de la Batalla de Boyacá",
    start: new Date(2025, 7, 7), // 7 agosto 2025
    end: new Date(2025, 7, 7),
    allDay: true,
    color: "blue",
  },
  {
    id: "semana-ciencia-agosto",
    title: "Semana Nacional de la Ciencia",
    description: "Eventos y actividades científicas en todo el país",
    start: new Date(2025, 7, 12), // 12 agosto 2025
    end: new Date(2025, 7, 16), // 16 agosto 2025
    allDay: true,
    color: "purple",
  },
  {
    id: "asuncion",
    title: "Asunción de la Virgen",
    description: "Festividad religiosa católica",
    start: new Date(2025, 7, 18), // 18 agosto 2025
    end: new Date(2025, 7, 18),
    allDay: true,
    color: "purple",
  },
  {
    id: "dia-juventud-agosto",
    title: "Día Nacional de la Juventud",
    description: "Celebración y actividades para jóvenes universitarios",
    start: new Date(2025, 7, 24), // 24 agosto 2025
    end: new Date(2025, 7, 24),
    allDay: true,
    color: "orange",
  },
  {
    id: "foro-educacion-agosto",
    title: "Foro Nacional de Educación Superior",
    description: "Encuentro nacional de rectores y directivos universitarios",
    start: new Date(2025, 7, 28), // 28 agosto 2025
    end: new Date(2025, 7, 30), // 30 agosto 2025
    allDay: true,
    color: "blue",
  },
  {
    id: "dia-raza",
    title: "Día de la Raza",
    description: "Conmemoración del encuentro de dos mundos",
    start: new Date(2025, 9, 13), // 13 octubre 2025
    end: new Date(2025, 9, 13),
    allDay: true,
    color: "orange",
  },
  {
    id: "todos-santos",
    title: "Día de Todos los Santos",
    description: "Festividad religiosa católica",
    start: new Date(2025, 10, 3), // 3 noviembre 2025
    end: new Date(2025, 10, 3),
    allDay: true,
    color: "purple",
  },
  {
    id: "independencia-cartagena",
    title: "Independencia de Cartagena",
    description: "Conmemoración de la independencia de Cartagena",
    start: new Date(2025, 10, 17), // 17 noviembre 2025
    end: new Date(2025, 10, 17),
    allDay: true,
    color: "blue",
  },
  {
    id: "inmaculada",
    title: "Inmaculada Concepción",
    description: "Festividad religiosa católica",
    start: new Date(2025, 11, 8), // 8 diciembre 2025
    end: new Date(2025, 11, 8),
    allDay: true,
    color: "purple",
  },
  {
    id: "navidad",
    title: "Navidad",
    description: "Celebración del nacimiento de Jesucristo",
    start: new Date(2025, 11, 25), // 25 diciembre 2025
    end: new Date(2025, 11, 25),
    allDay: true,
    color: "pink",
  },
  {
    id: "new-year-2026",
    title: "Año Nuevo 2026",
    description: "Celebración del inicio del nuevo año",
    start: new Date(2026, 0, 1), // 1 enero 2026
    end: new Date(2026, 0, 1),
    allDay: true,
    color: "blue",
  },
  {
    id: "reyes-magos-2026",
    title: "Día de los Reyes Magos",
    description: "Festividad religiosa tradicional",
    start: new Date(2026, 0, 6), // 6 enero 2026
    end: new Date(2026, 0, 6),
    allDay: true,
    color: "purple",
  },
  {
    id: "san-jose-2026",
    title: "Día de San José",
    description: "Festividad religiosa católica",
    start: new Date(2026, 2, 23), // 23 marzo 2026 (trasladado al lunes)
    end: new Date(2026, 2, 23),
    allDay: true,
    color: "purple",
  },
]

// Etiquetas específicas para calendario nacional
const nationalEtiquettes: Etiquette[] = [
  {
    id: "festividades-religiosas",
    name: "Festividades Religiosas",
    color: "purple",
    isActive: true,
  },
  {
    id: "fiestas-patrias",
    name: "Fiestas Patrias",
    color: "blue",
    isActive: true,
  },
  {
    id: "eventos-academicos",
    name: "Eventos Académicos",
    color: "green",
    isActive: true,
  },
  {
    id: "salud-publica",
    name: "Salud Pública",
    color: "red",
    isActive: true,
  },
  {
    id: "ciencia-tecnologia",
    name: "Ciencia y Tecnología",
    color: "orange",
    isActive: true,
  },
  {
    id: "celebraciones-especiales",
    name: "Celebraciones Especiales",
    color: "pink",
    isActive: true,
  },
]

interface NationalCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
}

export default function NationalCalendar({
  userRole = "user",
}: NationalCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(nationalEvents)

  // Estado local para colores visibles - comenzamos con todos los colores visibles
  const [visibleColors, setVisibleColors] = useState<Set<EventColor>>(
    new Set(nationalEtiquettes.map((etiquette) => etiquette.color)),
  )

  // Función para alternar visibilidad de color
  const toggleColorVisibility = useCallback((color: string) => {
    setVisibleColors((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(color as EventColor)) {
        newSet.delete(color as EventColor)
      } else {
        newSet.add(color as EventColor)
      }
      return newSet
    })
  }, [])

  // Función para verificar si un color es visible
  const isColorVisible = useCallback(
    (color?: string) => (color ? visibleColors.has(color as EventColor) : true),
    [visibleColors],
  )

  // Obtener permisos para calendario nacional
  const permissions = useCalendarPermissions("national", userRole)

  // Filtrar eventos basado en colores visibles
  const visibleEvents = useMemo(() => {
    return events.filter((event) =>
      event.color ? isColorVisible(event.color) : true,
    )
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
    <div className="space-y-4">
      <LabelsHeader
        etiquettes={nationalEtiquettes}
        isColorVisible={isColorVisible}
        toggleColorVisibility={toggleColorVisibility}
      />
      <SetupCalendar
        events={visibleEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView="month"
        editable={permissions.canEdit}
        permissions={permissions}
      />
    </div>
  )
}
