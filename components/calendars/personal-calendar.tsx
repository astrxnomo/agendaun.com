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
import {
  type CalendarEvent,
  type CustomLabel,
} from "@/components/calendar/types"

import { LabelsHeader } from "../calendar/labels-header"

// Función para calcular días hasta el próximo lunes
const getDaysUntilNextMonday = (date: Date) => {
  const day = getDay(date) // 0 es domingo, 1 es lunes, 6 es sábado
  return day === 1 ? 0 : day === 0 ? 1 : 8 - day
}

const currentDate = new Date()
const daysUntilNextMonday = getDaysUntilNextMonday(currentDate)

// Etiquetas personalizadas para el calendario personal
const personalLabels: CustomLabel[] = [
  { id: "materias", name: "Materias", color: "blue" },
  { id: "reuniones", name: "Reuniones", color: "orange" },
  { id: "semilleros", name: "Semilleros", color: "green" },
  { id: "examenes", name: "Exámenes", color: "red" },
  { id: "personal", name: "Personal", color: "pink" },
  { id: "proyectos", name: "Proyectos", color: "purple" },
]

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
    labelId: "materias",
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
    labelId: "reuniones",
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
    color: "green",
    labelId: "semilleros",
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
    labelId: "examenes",
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
    color: "pink",
    labelId: "personal",
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
    labelId: "proyectos",
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
    labelId: "materias",
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
    labelId: "reuniones",
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
    labelId: "proyectos",
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
    color: "pink",
    labelId: "personal",
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
    location: "Lugar sin etiqueta",
  },
]

interface PersonalCalendarProps {
  editable?: boolean
  calendarType?: CalendarType
  userRole?: UserRole
  labels?: CustomLabel[]
  onLabelsChange?: (labels: CustomLabel[]) => void
}

export default function PersonalCalendar({
  editable = true,
  calendarType = "personal",
  userRole = "user",
  labels: propsLabels = personalLabels,
  onLabelsChange,
}: PersonalCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(personalEvents)
  const [labels, setLabels] = useState<CustomLabel[]>(propsLabels)
  const { isLabelVisible } = useCalendarContext()

  const permissions = useCalendarPermissions(calendarType, userRole)
  const isEditable = editable && permissions.canEdit

  const handleLabelAdd = (newLabel: Omit<CustomLabel, "id">) => {
    const label: CustomLabel = {
      ...newLabel,
      id: crypto.randomUUID(),
    }
    const updatedLabels = [...labels, label]
    setLabels(updatedLabels)
    onLabelsChange?.(updatedLabels)
  }

  const handleLabelUpdate = (id: string, updates: Partial<CustomLabel>) => {
    const updatedLabels = labels.map((label) =>
      label.id === id ? { ...label, ...updates } : label,
    )
    setLabels(updatedLabels)
    onLabelsChange?.(updatedLabels)
  }

  const handleLabelDelete = (labelId: string) => {
    const updatedLabels = labels.filter((label) => label.id !== labelId)
    setLabels(updatedLabels)
    onLabelsChange?.(updatedLabels)

    // También actualizar eventos que usen esta etiqueta
    setEvents(
      events.map((event) => ({
        ...event,
        labelId: event.labelId === labelId ? undefined : event.labelId,
        label: event.label === labelId ? undefined : event.label,
      })),
    )
  }

  const handleLabelToggle = (_labelId: string) => {
    // Esta función se maneja en el CalendarContext
    // pero podríamos agregar lógica adicional aquí si fuera necesario
  }
  // Filtrar eventos basado en etiquetas visibles
  const visibleEvents = useMemo(() => {
    const isEventVisible = (event: CalendarEvent) => {
      if (event.labelId) {
        return isLabelVisible(event.labelId)
      }
      if (event.label) {
        return isLabelVisible(event.label)
      }
      return true // Eventos sin etiqueta siempre visibles
    }

    return events.filter(isEventVisible)
  }, [events, isLabelVisible])

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
        editable={isEditable}
        labels={labels}
        onLabelAdd={handleLabelAdd}
        onLabelUpdate={handleLabelUpdate}
        onLabelDelete={handleLabelDelete}
        onLabelToggle={handleLabelToggle}
      />
      <SetupCalendar
        events={visibleEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView="week"
        editable={isEditable}
        permissions={permissions}
        calendarType="personal"
        customLabels={labels}
        onLabelAdd={handleLabelAdd}
        onLabelUpdate={handleLabelUpdate}
        onLabelDelete={handleLabelDelete}
      />
    </>
  )
}
