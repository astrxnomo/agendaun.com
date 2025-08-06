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
  type EventColor,
} from "@/components/calendar/types"

// Etiquetas para el filtrado del calendario
export const etiquettes = [
  {
    id: "mis-eventos",
    name: "Mis Eventos",
    color: "emerald" as EventColor,
    isActive: true,
  },
  {
    id: "equipo-marketing",
    name: "Equipo Marketing",
    color: "orange" as EventColor,
    isActive: true,
  },
  {
    id: "entrevistas",
    name: "Entrevistas",
    color: "violet" as EventColor,
    isActive: true,
  },
  {
    id: "planificacion-eventos",
    name: "Planificación Eventos",
    color: "blue" as EventColor,
    isActive: true,
  },
  {
    id: "vacaciones",
    name: "Vacaciones",
    color: "rose" as EventColor,
    isActive: true,
  },
]

// Función para calcular días hasta el próximo lunes
const getDaysUntilNextMonday = (date: Date) => {
  const day = getDay(date) // 0 es domingo, 1 es lunes, 6 es sábado
  return day === 1 ? 0 : day === 0 ? 1 : 8 - day // Si hoy es lunes, retorna 0, si es domingo retorna 1, sino calcula días hasta lunes
}

// Almacenar la fecha actual para evitar múltiples llamadas a new Date()
const currentDate = new Date()

// Calcular el offset una vez para evitar cálculos repetidos
const daysUntilNextMonday = getDaysUntilNextMonday(currentDate)

// Datos de eventos de ejemplo con horarios en español
const sampleEvents: CalendarEvent[] = [
  // Eventos específicos de agosto 2025 para pruebas
  {
    id: "aug-1",
    title: "Inicio de Clases - Preparación",
    description:
      "Preparar materiales y plan de estudios para el nuevo semestre",
    start: setMinutes(setHours(new Date(2025, 7, 1), 9), 0), // 1 agosto 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 1), 11), 0), // 1 agosto 2025, 11:00 AM
    color: "emerald",
    location: "Oficina personal",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-sistemas",
  },
  {
    id: "aug-3",
    title: "Reunión con Decano",
    description: "Reunión sobre planificación académica del semestre",
    start: setMinutes(setHours(new Date(2025, 7, 3), 14), 0), // 3 agosto 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 3), 15), 30), // 3 agosto 2025, 3:30 PM
    color: "blue",
    location: "Decanatura",
    sede: "sede-central",
    facultad: "ingenieria",
  },
  {
    id: "aug-9",
    title: "Taller de Investigación",
    description: "Participación en taller sobre metodologías de investigación",
    start: setMinutes(setHours(new Date(2025, 7, 9), 8), 0), // 9 agosto 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 9), 12), 0), // 9 agosto 2025, 12:00 PM
    color: "purple",
    location: "Centro de Investigación",
    sede: "sede-norte",
    facultad: "ciencias",
  },
  {
    id: "aug-15",
    title: "Cita Médica",
    description: "Chequeo médico anual",
    start: setMinutes(setHours(new Date(2025, 7, 15), 10), 0), // 15 agosto 2025, 10:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 15), 11), 0), // 15 agosto 2025, 11:00 AM
    color: "red",
    location: "Centro Médico Universitario",
  },
  {
    id: "aug-20",
    title: "Conferencia Personal",
    description: "Asistir a conferencia sobre desarrollo profesional",
    start: setMinutes(setHours(new Date(2025, 7, 20), 16), 0), // 20 agosto 2025, 4:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 20), 18), 0), // 20 agosto 2025, 6:00 PM
    color: "violet",
    location: "Auditorio Central",
    sede: "sede-central",
  },
  {
    id: "aug-25",
    title: "Almuerzo Familiar",
    description: "Reunión familiar mensual",
    start: setMinutes(setHours(new Date(2025, 7, 25), 12), 0), // 25 agosto 2025, 12:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 25), 14), 0), // 25 agosto 2025, 2:00 PM
    color: "orange",
    location: "Restaurante Casa Verde",
  },
  {
    id: "aug-30",
    title: "Revisión de Proyectos",
    description: "Evaluación de proyectos estudiantiles del semestre",
    start: setMinutes(setHours(new Date(2025, 7, 30), 9), 0), // 30 agosto 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 30), 17), 0), // 30 agosto 2025, 5:00 PM
    color: "blue",
    location: "Aula de Evaluación",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-sistemas",
  },

  // Eventos dinámicos basados en fecha actual
  {
    id: "w1-0a",
    title: "Reunión Junta Directiva",
    description: "Revisión trimestral con equipo ejecutivo",
    start: setMinutes(
      setHours(addDays(currentDate, -13 + daysUntilNextMonday), 9),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -13 + daysUntilNextMonday), 11),
      30,
    ),
    color: "blue",
    location: "Sala de Juntas Ejecutiva",
    sede: "sede-central",
    facultad: "administracion",
    programa: "administracion-empresas",
  },
  {
    id: "w1-0b",
    title: "Llamada con Inversionistas",
    description: "Actualizar inversionistas sobre progreso de la empresa",
    start: setMinutes(
      setHours(addDays(currentDate, -13 + daysUntilNextMonday), 14),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -13 + daysUntilNextMonday), 15),
      0,
    ),
    color: "violet",
    location: "Sala de Conferencias A",
    sede: "sede-norte",
    facultad: "administracion",
    programa: "administracion-empresas",
  },
  {
    id: "w1-1",
    title: "Taller de Estrategia",
    description: "Sesión anual de planificación estratégica",
    start: setMinutes(
      setHours(addDays(currentDate, -12 + daysUntilNextMonday), 8),
      30,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -12 + daysUntilNextMonday), 10),
      0,
    ),
    color: "violet",
    location: "Laboratorio de Innovación",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-sistemas",
  },
  {
    id: "w1-2",
    title: "Presentación a Cliente",
    description: "Presentar resultados trimestrales",
    start: setMinutes(
      setHours(addDays(currentDate, -12 + daysUntilNextMonday), 13),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -12 + daysUntilNextMonday), 14),
      30,
    ),
    color: "emerald",
    location: "Oficinas del Cliente",
    sede: "sede-sur",
    facultad: "administracion",
    programa: "administracion-empresas",
  },
  {
    id: "w1-3",
    title: "Revisión de Presupuesto",
    description: "Revisar presupuestos departamentales",
    start: setMinutes(
      setHours(addDays(currentDate, -11 + daysUntilNextMonday), 9),
      15,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -11 + daysUntilNextMonday), 11),
      0,
    ),
    color: "blue",
    location: "Sala de Finanzas",
    sede: "sede-central",
    facultad: "ciencias",
    programa: "psicologia",
  },
  {
    id: "w1-4",
    title: "Almuerzo de Equipo",
    description: "Almuerzo trimestral del equipo",
    start: setMinutes(
      setHours(addDays(currentDate, -11 + daysUntilNextMonday), 12),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -11 + daysUntilNextMonday), 13),
      30,
    ),
    color: "orange",
    location: "Bistro Jardín",
  },
  {
    id: "w1-5",
    title: "Inicio de Proyecto",
    description: "Lanzar nueva campaña de marketing",
    start: setMinutes(
      setHours(addDays(currentDate, -10 + daysUntilNextMonday), 10),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -10 + daysUntilNextMonday), 12),
      0,
    ),
    color: "orange",
    location: "Suite de Marketing",
  },
  {
    id: "w1-6",
    title: "Entrevista: Diseñador UX",
    description: "Primera ronda de entrevista",
    start: setMinutes(
      setHours(addDays(currentDate, -10 + daysUntilNextMonday), 14),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -10 + daysUntilNextMonday), 15),
      0,
    ),
    color: "violet",
    location: "Oficina de Recursos Humanos",
  },
  {
    id: "w1-7",
    title: "Reunión General Empresa",
    description: "Actualización mensual de la empresa",
    start: setMinutes(
      setHours(addDays(currentDate, -9 + daysUntilNextMonday), 9),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -9 + daysUntilNextMonday), 10),
      30,
    ),
    color: "emerald",
    location: "Auditorio Principal",
  },
  {
    id: "w1-8",
    title: "Demo de Producto",
    description: "Demostrar nuevas funciones a los interesados",
    start: setMinutes(
      setHours(addDays(currentDate, -9 + daysUntilNextMonday), 13),
      45,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -9 + daysUntilNextMonday), 15),
      0,
    ),
    color: "blue",
    location: "Sala de Demos",
  },
  {
    id: "w1-9",
    title: "Tiempo en Familia",
    description: "Rutina matutina con los niños",
    start: setMinutes(
      setHours(addDays(currentDate, -8 + daysUntilNextMonday), 7),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -8 + daysUntilNextMonday), 7),
      30,
    ),
    color: "rose",
  },
  {
    id: "w1-10",
    title: "Tiempo en Familia",
    description: "Desayuno con la familia",
    start: setMinutes(
      setHours(addDays(currentDate, -8 + daysUntilNextMonday), 10),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -8 + daysUntilNextMonday), 10),
      30,
    ),
    color: "rose",
  },
  {
    id: "5e",
    title: "Tiempo en Familia",
    description: "Tiempo para pasar con la familia",
    start: setMinutes(
      setHours(addDays(currentDate, -7 + daysUntilNextMonday), 10),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -7 + daysUntilNextMonday), 13),
      30,
    ),
    color: "rose",
  },
  {
    id: "1b",
    title: "Reunión con Ely",
    description: "Planificación estratégica para el próximo año",
    start: setMinutes(
      setHours(addDays(currentDate, -6 + daysUntilNextMonday), 7),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -6 + daysUntilNextMonday), 8),
      0,
    ),
    color: "orange",
    location: "Sala de Conferencias Principal",
  },
  {
    id: "1c",
    title: "Reunión de Equipo",
    description: "Sincronización semanal del equipo",
    start: setMinutes(
      setHours(addDays(currentDate, -6 + daysUntilNextMonday), 8),
      15,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -6 + daysUntilNextMonday), 11),
      0,
    ),
    color: "blue",
    location: "Sala de Conferencias Principal",
  },
  {
    id: "1d",
    title: "Seguimiento con Pedra",
    description: "Coordinar operaciones",
    start: setMinutes(
      setHours(addDays(currentDate, -6 + daysUntilNextMonday), 15),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -6 + daysUntilNextMonday), 16),
      0,
    ),
    color: "blue",
    location: "Main Conference Hall",
  },
  {
    id: "1e",
    title: "Teem Intro",
    description: "Introduce team members",
    start: setMinutes(
      setHours(addDays(currentDate, -5 + daysUntilNextMonday), 8),
      15,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -5 + daysUntilNextMonday), 9),
      30,
    ),
    color: "emerald",
    location: "Main Conference Hall",
  },
  {
    id: "1f",
    title: "Task Presentation",
    description: "Present tasks",
    start: setMinutes(
      setHours(addDays(currentDate, -5 + daysUntilNextMonday), 10),
      45,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -5 + daysUntilNextMonday), 13),
      30,
    ),
    color: "emerald",
    location: "Main Conference Hall",
  },
  {
    id: "5",
    title: "Product Meeting",
    description: "Discuss product requirements",
    start: setMinutes(
      setHours(addDays(currentDate, -4 + daysUntilNextMonday), 9),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -4 + daysUntilNextMonday), 11),
      30,
    ),
    color: "orange",
    location: "Downtown Cafe",
  },
  {
    id: "5b",
    title: "Team Meeting",
    description: "Discuss new project requirements",
    start: setMinutes(
      setHours(addDays(currentDate, -4 + daysUntilNextMonday), 13),
      30,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -4 + daysUntilNextMonday), 14),
      0,
    ),
    color: "violet",
    location: "Downtown Cafe",
  },
  {
    id: "5c",
    title: "1:1 w/ Tommy",
    description: "Talent review",
    start: setMinutes(
      setHours(addDays(currentDate, -3 + daysUntilNextMonday), 9),
      45,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -3 + daysUntilNextMonday), 10),
      45,
    ),
    color: "violet",
    location: "Abbey Road Room",
  },
  {
    id: "5d",
    title: "Kick-off call",
    description: "Ultra fast call with Sonia",
    start: setMinutes(
      setHours(addDays(currentDate, -3 + daysUntilNextMonday), 11),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -3 + daysUntilNextMonday), 11),
      30,
    ),
    color: "violet",
    location: "Abbey Road Room",
  },
  {
    id: "5ef",
    title: "Weekly Review",
    description: "Manual process review",
    start: setMinutes(
      setHours(addDays(currentDate, -2 + daysUntilNextMonday), 8),
      45,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -2 + daysUntilNextMonday), 9),
      45,
    ),
    color: "blue",
  },
  {
    id: "5f",
    title: "Meeting w/ Mike",
    description: "Explore new ideas",
    start: setMinutes(
      setHours(addDays(currentDate, -2 + daysUntilNextMonday), 14),
      30,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -2 + daysUntilNextMonday), 15),
      30,
    ),
    color: "orange",
    location: "Main Conference Hall",
  },
  {
    id: "5g",
    title: "Family Time",
    description: "Some time to spend with family",
    start: setMinutes(
      setHours(addDays(currentDate, -1 + daysUntilNextMonday), 7),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -1 + daysUntilNextMonday), 7),
      30,
    ),
    color: "rose",
  },
  {
    id: "w3-1",
    title: "Quarterly Planning",
    description: "Plan next quarter objectives",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday), 9),
      30,
    ),
    end: setMinutes(setHours(addDays(currentDate, daysUntilNextMonday), 12), 0),
    color: "blue",
    location: "Planning Room",
  },
  {
    id: "w3-2",
    title: "Vendor Meeting",
    description: "Review vendor proposals",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 1), 7),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 1), 8),
      30,
    ),
    color: "violet",
    location: "Meeting Room B",
  },
  {
    id: "w3-3",
    title: "Design Workshop",
    description: "Brainstorming session for new UI",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 1), 10),
      15,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 1), 12),
      45,
    ),
    color: "emerald",
    location: "Design Studio",
  },
  {
    id: "w3-4",
    title: "Lunch with CEO",
    description: "Informal discussion about company vision",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 1), 13),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 1), 14),
      30,
    ),
    color: "orange",
    location: "Executive Dining Room",
  },
  {
    id: "w3-5",
    title: "Technical Review",
    description: "Code review with engineering team",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 2), 11),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 2), 12),
      30,
    ),
    color: "blue",
    location: "Engineering Lab",
  },
  {
    id: "w3-6",
    title: "Customer Call",
    description: "Follow-up with key customer",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 2), 15),
      15,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 2), 16),
      0,
    ),
    color: "violet",
    location: "Call Center",
  },
  {
    id: "w3-7",
    title: "Team Building",
    description: "Offsite team building activity",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 3), 9),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 3), 17),
      0,
    ),
    color: "emerald",
    location: "Adventure Park",
    allDay: true,
  },
  {
    id: "w3-8",
    title: "Marketing Review",
    description: "Review campaign performance",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 4), 8),
      45,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 4), 10),
      15,
    ),
    color: "orange",
    location: "Marketing Room",
  },
  {
    id: "w3-9",
    title: "Product Roadmap",
    description: "Discuss product roadmap for next quarter",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 5), 14),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 5), 16),
      30,
    ),
    color: "blue",
    location: "Strategy Room",
  },
  {
    id: "w3-10",
    title: "Family Time",
    description: "Morning walk with family",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 6), 7),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 6), 7),
      30,
    ),
    color: "rose",
  },
  {
    id: "w3-11",
    title: "Family Time",
    description: "Brunch with family",
    start: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 6), 10),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, daysUntilNextMonday + 6), 10),
      30,
    ),
    color: "rose",
  },
]

export default function MyCalendar({
  editable = true,
  calendarType = "personal",
  userRole = "user",
}: {
  editable?: boolean
  calendarType?: CalendarType
  userRole?: UserRole
}) {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents)
  const { isColorVisible, filterEventsByAcademicFilters } = useCalendarContext()

  // Obtener permisos basados en el tipo de calendario y rol del usuario
  const permissions = useCalendarPermissions(calendarType, userRole)

  // El calendario es editable si se permite explícitamente Y el usuario tiene permisos
  const isEditable = editable && permissions.canEdit

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
