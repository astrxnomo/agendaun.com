"use client"

import { setHours, setMinutes } from "date-fns"
import { useCallback, useMemo, useState } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import { LabelsHeader } from "@/components/calendar/labels-header"
import { useCalendarPermissions } from "@/components/calendar/permissions"
import { SetupCalendar } from "@/components/calendar/setup-calendar"
import { type CalendarEvent, type Etiquette } from "@/components/calendar/types"

// Etiquetas específicas para el calendario de sede
export const sedeEtiquettes: Etiquette[] = [
  {
    id: "administrativo",
    name: "Administrativo",
    color: "blue",
    isActive: true,
  },
  { id: "academico", name: "Académico", color: "green", isActive: true },
  {
    id: "mantenimiento",
    name: "Mantenimiento",
    color: "orange",
    isActive: true,
  },
  { id: "eventos", name: "Eventos", color: "purple", isActive: true },
  { id: "bienestar", name: "Bienestar", color: "pink", isActive: true },
]

// Eventos específicos de sede - eventos administrativos y académicos de sede (desde agosto 2025)
const sedeEvents: CalendarEvent[] = [
  {
    id: "bienvenida-estudiantes-agosto",
    title: "Bienvenida a Estudiantes Nuevos",
    description: "Ceremonia de bienvenida para estudiantes de primer semestre",
    start: new Date(2025, 7, 2), // 2 agosto 2025
    end: new Date(2025, 7, 2),
    allDay: true,
    color: "green",
    location: "Auditorio Principal - Sede Central",
    sede: "sede-central",
  },
  {
    id: "induccion-docentes-agosto",
    title: "Inducción Docentes Nuevos",
    description: "Jornada de inducción para profesores de nuevo ingreso",
    start: new Date(2025, 7, 6), // 6 agosto 2025
    end: new Date(2025, 7, 6),
    allDay: true,
    color: "blue",
    location: "Centro de Formación - Sede Norte",
    sede: "sede-norte",
  },
  {
    id: "reunion-decanos-agosto",
    title: "Reunión de Decanos",
    description: "Reunión mensual de decanos de la sede central",
    start: setMinutes(setHours(new Date(2025, 7, 10), 9), 0), // 10 agosto 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 10), 11), 0), // 10 agosto 2025, 11:00 AM
    allDay: false,
    color: "blue",
    location: "Sala de Juntas - Sede Central",
    sede: "sede-central",
    facultad: "administracion",
  },
  {
    id: "feria-servicios-agosto",
    title: "Feria de Servicios Estudiantiles",
    description: "Exposición de servicios y beneficios para estudiantes",
    start: new Date(2025, 7, 14), // 14 agosto 2025
    end: new Date(2025, 7, 14),
    allDay: true,
    color: "orange",
    location: "Plaza Central - Sede Sur",
    sede: "sede-sur",
  },
  {
    id: "jornada-inscripciones-sede-norte",
    title: "Jornada de Inscripciones",
    description: "Jornada especial de inscripciones para estudiantes nuevos",
    start: setMinutes(setHours(new Date(2025, 7, 20), 8), 0), // 20 agosto 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 20), 18), 0), // 20 agosto 2025, 6:00 PM
    allDay: false,
    color: "green",
    location: "Centro de Atención - Sede Norte",
    sede: "sede-norte",
  },
  {
    id: "taller-liderazgo-agosto",
    title: "Taller de Liderazgo Estudiantil",
    description: "Capacitación en liderazgo para representantes estudiantiles",
    start: new Date(2025, 7, 22), // 22 agosto 2025
    end: new Date(2025, 7, 23), // 23 agosto 2025
    allDay: true,
    color: "purple",
    location: "Auditorio - Sede Este",
    sede: "sede-este",
  },
  {
    id: "revision-infraestructura-agosto",
    title: "Revisión de Infraestructura",
    description: "Inspección y mantenimiento de instalaciones",
    start: new Date(2025, 7, 26), // 26 agosto 2025
    end: new Date(2025, 7, 28), // 28 agosto 2025
    allDay: true,
    color: "orange",
    location: "Todas las sedes",
    sede: "sede-central",
  },
  {
    id: "mantenimiento-laboratorios-sede-sur",
    title: "Mantenimiento de Laboratorios",
    description: "Mantenimiento programado de equipos de laboratorio",
    start: new Date(2025, 8, 1), // 1 septiembre 2025
    end: new Date(2025, 8, 3), // 3 septiembre 2025
    allDay: true,
    color: "orange",
    location: "Laboratorios - Sede Sur",
    sede: "sede-sur",
    facultad: "ingenieria",
  },
  {
    id: "ceremonia-grados-sede-central",
    title: "Ceremonia de Graduación",
    description: "Ceremonia de graduación del segundo período 2025",
    start: setMinutes(setHours(new Date(2025, 8, 15), 14), 0), // 15 septiembre 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 8, 15), 18), 0), // 15 septiembre 2025, 6:00 PM
    allDay: false,
    color: "purple",
    location: "Auditorio Principal - Sede Central",
    sede: "sede-central",
  },
  {
    id: "feria-bienestar-sede-este",
    title: "Feria de Bienestar Universitario",
    description: "Feria con actividades de bienestar y salud mental",
    start: setMinutes(setHours(new Date(2025, 9, 10), 9), 0), // 10 octubre 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 9, 10), 16), 0), // 10 octubre 2025, 4:00 PM
    allDay: false,
    color: "pink",
    location: "Plaza Central - Sede Este",
    sede: "sede-este",
  },
  {
    id: "simulacro-evacuacion-sede-norte",
    title: "Simulacro de Evacuación",
    description: "Simulacro anual de evacuación y emergencias",
    start: setMinutes(setHours(new Date(2025, 9, 25), 10), 0), // 25 octubre 2025, 10:00 AM
    end: setMinutes(setHours(new Date(2025, 9, 25), 11), 30), // 25 octubre 2025, 11:30 AM
    allDay: false,
    color: "orange",
    location: "Toda la Sede Norte",
    sede: "sede-norte",
  },
  {
    id: "reunion-consejo-sede-central",
    title: "Consejo de Sede",
    description: "Reunión del consejo académico de sede",
    start: setMinutes(setHours(new Date(2025, 10, 5), 14), 0), // 5 noviembre 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 10, 5), 17), 0), // 5 noviembre 2025, 5:00 PM
    allDay: false,
    color: "blue",
    location: "Sala del Consejo - Sede Central",
    sede: "sede-central",
  },
  {
    id: "jornada-investigacion-sede-sur",
    title: "Jornada de Investigación",
    description: "Presentación de proyectos de investigación de la sede",
    start: setMinutes(setHours(new Date(2025, 10, 18), 8), 0), // 18 noviembre 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 10, 18), 17), 0), // 18 noviembre 2025, 5:00 PM
    allDay: false,
    color: "green",
    location: "Centro de Investigaciones - Sede Sur",
    sede: "sede-sur",
    facultad: "ciencias",
  },
]

interface SedeCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
  sedeName?: string
}

export default function SedeCalendar({ userRole = "user" }: SedeCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(sedeEvents)
  const { filterEventsByAcademicFilters } = useCalendarContext()

  // Estado local para las etiquetas de este calendario específico
  const [visibleColors, setVisibleColors] = useState<string[]>(() => {
    return sedeEtiquettes
      .filter((etiquette) => etiquette.isActive)
      .map((etiquette) => etiquette.color)
  })

  // Obtener permisos para calendario de sede
  const permissions = useCalendarPermissions("department", userRole)

  // Función para alternar visibilidad de color (local a este calendario)
  const toggleColorVisibility = (color: string) => {
    setVisibleColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color)
      } else {
        return [...prev, color]
      }
    })
  }

  // Función para verificar si un color es visible (local a este calendario)
  const isColorVisible = useCallback(
    (color: string | undefined) => {
      if (!color) return true
      return visibleColors.includes(color)
    },
    [visibleColors],
  )

  // Filtrar eventos basado en colores visibles Y filtros académicos
  const visibleEvents = useMemo(() => {
    // Primero filtrar por colores visibles
    const colorFilteredEvents = events.filter((event) =>
      isColorVisible(event.color),
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
    <>
      <LabelsHeader
        etiquettes={sedeEtiquettes}
        isColorVisible={isColorVisible}
        toggleColorVisibility={toggleColorVisibility}
        title="Etiquetas de Sede"
      />
      <SetupCalendar
        events={visibleEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView="month"
        editable={false}
        permissions={permissions}
      />
    </>
  )
}
