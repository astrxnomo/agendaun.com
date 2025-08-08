"use client"

import { addDays, getDay, setHours, setMinutes } from "date-fns"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  type CalendarEvent,
  type CalendarType,
  type Etiquette,
  EtiquettesHeader,
  SetupCalendar,
  type UserRole,
  useCalendarManager,
  useCalendarPermissions,
} from "@/components/calendar"

// Función para calcular días hasta el próximo lunes
const getDaysUntilNextMonday = (date: Date) => {
  const day = getDay(date) // 0 es domingo, 1 es lunes, 6 es sábado
  return day === 1 ? 0 : day === 0 ? 1 : 8 - day
}

const currentDate = new Date()
const daysUntilNextMonday = getDaysUntilNextMonday(currentDate)

// Etiquetas personalizadas para el calendario personal
export const personalEtiquettes: Etiquette[] = [
  { id: "materias", name: "Materias", color: "blue", isActive: true },
  { id: "reuniones", name: "Reuniones", color: "orange", isActive: true },
  { id: "semilleros", name: "Semilleros", color: "green", isActive: false },
  { id: "examenes", name: "Exámenes", color: "red", isActive: true },
  { id: "personal", name: "Personal", color: "pink", isActive: true },
  { id: "proyectos", name: "Proyectos", color: "purple", isActive: true },
  {
    id: "sin-etiqueta",
    name: "Sin Etiqueta",
    color: "gray",
    isActive: true,
  },
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
  labels?: Etiquette[]
  onLabelsChange?: (labels: Etiquette[]) => void
}

export default function PersonalCalendar({
  editable = true,
  calendarType = "personal",
  userRole = "user",
}: PersonalCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(personalEvents)
  const calendarManager = useCalendarManager("personal")
  const permissions = useCalendarPermissions(calendarType, userRole)

  // Initialize etiquettes for this calendar only once using useEffect
  const etiquettesInitialized = useRef(false)

  useEffect(() => {
    if (!etiquettesInitialized.current) {
      calendarManager.setCalendarEtiquettes(personalEtiquettes)
      etiquettesInitialized.current = true
    }
  }, [calendarManager])

  // Filter events based on visible colors
  const visibleEvents = useMemo(() => {
    return events.filter((event) =>
      calendarManager.isEtiquetteVisible(event.color),
    )
  }, [events, calendarManager])

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event])
  }

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    )
  }

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
  }

  return (
    <>
      <EtiquettesHeader
        etiquettes={personalEtiquettes}
        isEtiquetteVisible={calendarManager.isEtiquetteVisible}
        toggleEtiquetteVisibility={calendarManager.toggleEtiquetteVisibility}
      />
      <SetupCalendar
        events={visibleEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView="week"
        editable={editable}
        permissions={permissions}
        customEtiquettes={personalEtiquettes}
      />
    </>
  )
}
