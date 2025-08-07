"use client"

import { setHours, setMinutes } from "date-fns"
import { useCallback, useMemo, useState } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import { LabelsHeader } from "@/components/calendar/labels-header"
import { useCalendarPermissions } from "@/components/calendar/permissions"
import { SetupCalendar } from "@/components/calendar/setup-calendar"
import {
  type CalendarEvent,
  type Etiquette,
  type EventColor,
} from "@/components/calendar/types"

// Eventos específicos de facultad - eventos académicos y administrativos de facultades (desde agosto 2025)
const facultadEvents: CalendarEvent[] = [
  {
    id: "orientacion-ingenieria-agosto",
    title: "Orientación Académica - Ingeniería",
    description: "Sesión de orientación para estudiantes de nuevo ingreso",
    start: new Date(2025, 7, 3), // 3 agosto 2025
    end: new Date(2025, 7, 3),
    allDay: true,
    color: "green",
    location: "Facultad de Ingeniería",
    sede: "sede-central",
    facultad: "ingenieria",
  },
  {
    id: "seminario-medicina-agosto",
    title: "Seminario de Ética Médica",
    description: "Seminario sobre ética y bioética en la práctica médica",
    start: setMinutes(setHours(new Date(2025, 7, 5), 14), 0), // 5 agosto 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 5), 17), 0), // 5 agosto 2025, 5:00 PM
    allDay: false,
    color: "red",
    location: "Auditorio - Facultad de Medicina",
    sede: "sede-central",
    facultad: "medicina",
  },
  {
    id: "consejo-facultad-ingenieria-agosto",
    title: "Consejo de Facultad - Ingeniería",
    description: "Reunión mensual del consejo de facultad de ingeniería",
    start: setMinutes(setHours(new Date(2025, 7, 8), 14), 0), // 8 agosto 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 8), 16), 0), // 8 agosto 2025, 4:00 PM
    allDay: false,
    color: "blue",
    location: "Sala de Juntas - Facultad de Ingeniería",
    sede: "sede-central",
    facultad: "ingenieria",
  },
  {
    id: "taller-administracion-agosto",
    title: "Taller de Emprendimiento",
    description: "Taller práctico sobre creación de empresas",
    start: new Date(2025, 7, 12), // 12 agosto 2025
    end: new Date(2025, 7, 14), // 14 agosto 2025
    allDay: true,
    color: "orange",
    location: "Facultad de Administración",
    sede: "sede-central",
    facultad: "administracion",
  },
  {
    id: "laboratorio-ciencias-agosto",
    title: "Práctica de Laboratorio - Química",
    description: "Sesión especial de laboratorio para estudiantes avanzados",
    start: setMinutes(setHours(new Date(2025, 7, 16), 8), 0), // 16 agosto 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 16), 12), 0), // 16 agosto 2025, 12:00 PM
    allDay: false,
    color: "purple",
    location: "Lab. de Química - Facultad de Ciencias",
    sede: "sede-norte",
    facultad: "ciencias",
  },
  {
    id: "charla-derecho-agosto",
    title: "Charla sobre Derechos Humanos",
    description: "Conferencia magistral sobre derechos fundamentales",
    start: setMinutes(setHours(new Date(2025, 7, 19), 15), 0), // 19 agosto 2025, 3:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 19), 17), 0), // 19 agosto 2025, 5:00 PM
    allDay: false,
    color: "purple",
    location: "Aula Magna - Facultad de Derecho",
    sede: "sede-central",
    facultad: "derecho",
  },

  {
    id: "mesa-redonda-psicologia-agosto",
    title: "Mesa Redonda - Salud Mental",
    description: "Discusión sobre salud mental en el ámbito universitario",
    start: setMinutes(setHours(new Date(2025, 7, 28), 10), 0), // 28 agosto 2025, 10:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 28), 12), 0), // 28 agosto 2025, 12:00 PM
    allDay: false,
    color: "pink",
    location: "Sala de Conferencias - Facultad de Psicología",
    sede: "sede-norte",
    facultad: "psicologia",
  },
  {
    id: "exposicion-arquitectura-agosto",
    title: "Exposición de Diseños Arquitectónicos",
    description: "Muestra de proyectos finales de estudiantes",
    start: new Date(2025, 7, 30), // 30 agosto 2025
    end: new Date(2025, 7, 31), // 31 agosto 2025
    allDay: true,
    color: "green",
    location: "Galería - Facultad de Arquitectura",
    sede: "sede-central",
    facultad: "arquitectura",
  },
  {
    id: "semana-ingenieria-septiembre",
    title: "Semana de la Ingeniería",
    description:
      "Eventos, conferencias y actividades de la semana de ingeniería",
    start: new Date(2025, 8, 16), // 16 septiembre 2025
    end: new Date(2025, 8, 20), // 20 septiembre 2025
    allDay: true,
    color: "green",
    location: "Facultad de Ingeniería",
    sede: "sede-central",
    facultad: "ingenieria",
  },
  {
    id: "conferencia-medicina-agosto",
    title: "Conferencia Internacional de Medicina",
    description: "Conferencia magistral sobre avances en medicina moderna",
    start: setMinutes(setHours(new Date(2025, 7, 25), 9), 0), // 25 agosto 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 25), 17), 0), // 25 agosto 2025, 5:00 PM
    allDay: false,
    color: "red",
    location: "Auditorio - Facultad de Medicina",
    sede: "sede-central",
    facultad: "medicina",
  },
  {
    id: "feria-proyectos-administracion",
    title: "Feria de Proyectos - Administración",
    description: "Exposición de proyectos de estudiantes de administración",
    start: setMinutes(setHours(new Date(2025, 8, 5), 8), 0), // 5 septiembre 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 8, 5), 18), 0), // 5 septiembre 2025, 6:00 PM
    allDay: false,
    color: "orange",
    location: "Hall Principal - Facultad de Administración",
    sede: "sede-central",
    facultad: "administracion",
  },
  {
    id: "simposio-derecho-octubre",
    title: "Simposio de Derecho Constitucional",
    description: "Simposio académico sobre derecho constitucional colombiano",
    start: setMinutes(setHours(new Date(2025, 9, 12), 8), 0), // 12 octubre 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 9, 12), 17), 0), // 12 octubre 2025, 5:00 PM
    allDay: false,
    color: "purple",
    location: "Facultad de Derecho",
    sede: "sede-central",
    facultad: "derecho",
  },
  {
    id: "jornada-investigacion-psicologia",
    title: "Jornada de Investigación en Psicología",
    description: "Presentación de trabajos de investigación en psicología",
    start: setMinutes(setHours(new Date(2025, 9, 18), 9), 0), // 18 octubre 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 9, 18), 16), 0), // 18 octubre 2025, 4:00 PM
    allDay: false,
    color: "pink",
    location: "Laboratorio de Psicología",
    sede: "sede-norte",
    facultad: "psicologia",
  },
  {
    id: "congreso-arquitectura-noviembre",
    title: "Congreso de Arquitectura Sostenible",
    description: "Congreso internacional sobre arquitectura y sostenibilidad",
    start: new Date(2025, 10, 14), // 14 noviembre 2025
    end: new Date(2025, 10, 16), // 16 noviembre 2025
    allDay: true,
    color: "green",
    location: "Facultad de Arquitectura",
    sede: "sede-central",
    facultad: "arquitectura",
  },
  {
    id: "taller-economia-noviembre",
    title: "Taller de Economía Digital",
    description: "Taller práctico sobre economía digital y fintech",
    start: setMinutes(setHours(new Date(2025, 10, 22), 14), 0), // 22 noviembre 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 10, 22), 18), 0), // 22 noviembre 2025, 6:00 PM
    allDay: false,
    color: "purple",
    location: "Aula de Cómputo - Facultad de Economía",
    sede: "sede-sur",
    facultad: "economia",
  },
  {
    id: "exposicion-artes-diciembre",
    title: "Exposición de Artes Visuales",
    description: "Exposición anual de trabajos de estudiantes de artes",
    start: new Date(2025, 11, 1), // 1 diciembre 2025
    end: new Date(2025, 11, 15), // 15 diciembre 2025
    allDay: true,
    color: "pink",
    location: "Galería - Facultad de Artes",
    sede: "sede-este",
    facultad: "artes",
  },
  {
    id: "defensa-tesis-educacion",
    title: "Jornada de Defensa de Tesis",
    description: "Defensas de tesis de maestría en educación",
    start: setMinutes(setHours(new Date(2025, 11, 10), 8), 0), // 10 diciembre 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 11, 10), 17), 0), // 10 diciembre 2025, 5:00 PM
    allDay: false,
    color: "indigo",
    location: "Facultad de Educación",
    sede: "sede-central",
    facultad: "educacion",
  },
]

// Etiquetas específicas para calendario de facultad
const facultadEtiquettes: Etiquette[] = [
  {
    id: "conferencias",
    name: "Conferencias",
    color: "red",
    isActive: true,
  },
  {
    id: "seminarios",
    name: "Seminarios",
    color: "blue",
    isActive: true,
  },
  {
    id: "talleres",
    name: "Talleres",
    color: "orange",
    isActive: true,
  },
  {
    id: "exposiciones",
    name: "Exposiciones",
    color: "green",
    isActive: true,
  },
  {
    id: "investigacion",
    name: "Investigación",
    color: "purple",
    isActive: true,
  },
  {
    id: "eventos-academicos",
    name: "Eventos Académicos",
    color: "pink",
    isActive: true,
  },
]

interface FacultadCalendarProps {
  editable?: boolean
}

export default function FacultadCalendar({
  editable = false,
}: FacultadCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(facultadEvents)
  const { filterEventsByAcademicFilters } = useCalendarContext()

  // Estado local para colores visibles - comenzamos con todos los colores visibles
  const [visibleColors, setVisibleColors] = useState<Set<EventColor>>(
    new Set(facultadEtiquettes.map((etiquette) => etiquette.color)),
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

  // Obtener permisos basados en el tipo de calendario
  const permissions = useCalendarPermissions("facultad", "user")

  // El calendario es editable si se permite explícitamente Y el usuario tiene permisos
  const isEditable = editable && permissions.canEdit

  // Filtrar eventos basado en colores visibles Y filtros académicos
  const visibleEvents = useMemo(() => {
    // Primero filtrar por colores visibles
    const colorFilteredEvents = events.filter((event) =>
      event.color ? isColorVisible(event.color) : true,
    )

    // Luego aplicar filtros académicos (sede, facultad, programa)
    return filterEventsByAcademicFilters(colorFilteredEvents)
  }, [events, isColorVisible, filterEventsByAcademicFilters])

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
        etiquettes={facultadEtiquettes}
        isColorVisible={isColorVisible}
        toggleColorVisibility={toggleColorVisibility}
      />
      <SetupCalendar
        events={visibleEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView="month"
        editable={isEditable}
        permissions={permissions}
      />
    </div>
  )
}
