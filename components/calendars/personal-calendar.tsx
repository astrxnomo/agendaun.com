"use client"

import { addDays, getDay, setHours, setMinutes } from "date-fns"
import { useMemo, useState } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import {
  type CalendarType,
  type UserRole,
  useCalendarPermissions,
} from "@/components/calendar/permissions"
import { SetupCalendar } from "@/components/calendar/setup-calendar"
import { type CalendarEvent } from "@/components/calendar/types"
import { useCustomLabels } from "@/components/custom-labels-context"

// Función para calcular días hasta el próximo lunes
const getDaysUntilNextMonday = (date: Date) => {
  const day = getDay(date) // 0 es domingo, 1 es lunes, 6 es sábado
  return day === 1 ? 0 : day === 0 ? 1 : 8 - day
}

const currentDate = new Date()
const daysUntilNextMonday = getDaysUntilNextMonday(currentDate)

// Eventos de ejemplo para Mi Calendario con etiquetas personalizadas
const personalEvents: CalendarEvent[] = [
  {
    id: "calculo-1",
    title: "Cálculo Diferencial",
    description: "Clase de límites y derivadas",
    start: setMinutes(
      setHours(addDays(currentDate, -6 + daysUntilNextMonday), 8),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -6 + daysUntilNextMonday), 10),
      0,
    ),
    color: "blue",
    label: "materias",
    location: "Aula 201",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-sistemas",
  },
  {
    id: "reunion-proyecto",
    title: "Reunión Proyecto Final",
    description: "Revisión de avances del proyecto de grado",
    start: setMinutes(
      setHours(addDays(currentDate, -5 + daysUntilNextMonday), 14),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -5 + daysUntilNextMonday), 16),
      0,
    ),
    color: "orange",
    label: "reuniones",
    location: "Biblioteca Central",
  },
  {
    id: "semillero-ia",
    title: "Semillero de IA",
    description: "Investigación en machine learning",
    start: setMinutes(
      setHours(addDays(currentDate, -4 + daysUntilNextMonday), 16),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -4 + daysUntilNextMonday), 18),
      0,
    ),
    color: "emerald",
    label: "semilleros",
    location: "Laboratorio de IA",
  },
  {
    id: "examen-algoritmos",
    title: "Examen Algoritmos",
    description: "Evaluación parcial de algoritmos y estructuras de datos",
    start: setMinutes(
      setHours(addDays(currentDate, -3 + daysUntilNextMonday), 8),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -3 + daysUntilNextMonday), 10),
      0,
    ),
    color: "red",
    label: "examenes",
    location: "Aula Magna",
  },
  {
    id: "gimnasio",
    title: "Gimnasio",
    description: "Rutina de ejercicio",
    start: setMinutes(
      setHours(addDays(currentDate, -2 + daysUntilNextMonday), 18),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -2 + daysUntilNextMonday), 19),
      30,
    ),
    color: "rose",
    label: "personal",
    location: "Gimnasio Universitario",
  },
  {
    id: "proyecto-web",
    title: "Desarrollo Proyecto Web",
    description: "Trabajo en proyecto de desarrollo web",
    start: setMinutes(
      setHours(addDays(currentDate, -1 + daysUntilNextMonday), 19),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -1 + daysUntilNextMonday), 21),
      0,
    ),
    color: "purple",
    label: "proyectos",
    location: "Casa",
  },
  // Eventos de esta semana
  {
    id: "programacion-avanzada",
    title: "Programación Avanzada",
    description: "Patrones de diseño y arquitectura de software",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday), 10),
      0,
    ),
    end: setMinutes(setHours(addDays(currentDate, daysUntilNextMonday), 12), 0),
    color: "blue",
    label: "materias",
    location: "Aula 305",
  },
  {
    id: "reunion-semillero",
    title: "Reunión Semillero",
    description: "Planificación de actividades del semestre",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 1), 15),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 1), 17),
      0,
    ),
    color: "orange",
    label: "reuniones",
    location: "Sala de Juntas",
  },
  {
    id: "presentacion-proyecto",
    title: "Presentación Proyecto",
    description: "Presentación final del proyecto de investigación",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 2), 9),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 2), 11),
      0,
    ),
    color: "purple",
    label: "proyectos",
    location: "Auditorio",
  },
  {
    id: "almuerzo-amigos",
    title: "Almuerzo con Amigos",
    description: "Reunión social con compañeros de clase",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 3), 12),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 3), 14),
      0,
    ),
    color: "rose",
    label: "personal",
    location: "Cafetería Universitaria",
  },
  // Evento sin etiqueta para probar
  {
    id: "evento-sin-etiqueta",
    title: "Evento Sin Etiqueta",
    description: "Este evento no tiene etiqueta asignada",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 4), 16),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 4), 17),
      0,
    ),
    color: "yellow", // Color que no está asociado a ninguna etiqueta
    location: "Lugar sin etiqueta",
  },
]

interface PersonalCalendarProps {
  editable?: boolean
  calendarType?: CalendarType
  userRole?: UserRole
}

export default function PersonalCalendar({
  editable = true,
  calendarType = "personal",
  userRole = "user",
}: PersonalCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(personalEvents)
  const { filterEventsByAcademicFilters } = useCalendarContext()
  const { isEventVisible } = useCustomLabels()

  // Obtener permisos basados en el tipo de calendario y rol del usuario
  const permissions = useCalendarPermissions(calendarType, userRole)

  // El calendario es editable si se permite explícitamente Y el usuario tiene permisos
  const isEditable = editable && permissions.canEdit

  // Filtrar eventos basado en etiquetas visibles Y filtros académicos
  const visibleEvents = useMemo(() => {
    // Primero filtrar por etiquetas personalizadas
    const labelFilteredEvents = events.filter((event) => {
      return isEventVisible(event)
    })

    // Luego aplicar filtros académicos (sede, facultad, programa)
    return filterEventsByAcademicFilters(labelFilteredEvents)
  }, [events, isEventVisible, filterEventsByAcademicFilters])

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
      initialView="week"
      editable={isEditable}
      calendarType={calendarType}
      permissions={permissions}
    />
  )
}
