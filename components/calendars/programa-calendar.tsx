"use client"

import { addDays, setHours, setMinutes } from "date-fns"
import { useEffect, useMemo, useRef } from "react"

import {
  EtiquettesHeader,
  SetupCalendar,
  useCalendarManager,
  useCalendarPermissions,
  type CalendarEvent,
  type Etiquette,
} from "@/components/calendar"

// Función para calcular días hasta el próximo lunes
const getDaysUntilNextMonday = (date: Date) => {
  const day = date.getDay() // 0 es domingo, 1 es lunes, 6 es sábado
  return day === 1 ? 0 : day === 0 ? 1 : 8 - day
}

const currentDate = new Date()
const daysUntilNextMonday = getDaysUntilNextMonday(currentDate)

// Eventos específicos de programa - eventos académicos del programa de estudios
const programaEvents: CalendarEvent[] = [
  {
    id: "induccion-sistemas-agosto",
    title: "Inducción - Ingeniería de Sistemas",
    description: "Jornada de inducción para nuevos estudiantes del programa",
    start: new Date(2025, 7, 1), // 1 agosto 2025
    end: new Date(2025, 7, 2), // 2 agosto 2025
    allDay: true,
    color: "green",
    location: "Aula Magna - Edificio de Ingeniería",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-sistemas",
  },
  {
    id: "clase-algoritmos-agosto",
    title: "Algoritmos y Estructuras de Datos",
    description: "Clase presencial de algoritmos fundamentales",
    start: setMinutes(setHours(new Date(2025, 7, 5), 8), 0), // 5 agosto 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 5), 10), 0), // 5 agosto 2025, 10:00 AM
    allDay: false,
    color: "blue",
    location: "Aula 301 - Edificio de Ingeniería",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-sistemas",
  },
  {
    id: "laboratorio-programacion-agosto",
    title: "Laboratorio de Programación",
    description: "Práctica de programación en Java",
    start: setMinutes(setHours(new Date(2025, 7, 8), 14), 0), // 8 agosto 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 8), 16), 0), // 8 agosto 2025, 4:00 PM
    allDay: false,
    color: "purple",
    location: "Lab. de Cómputo 2",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-sistemas",
  },
  {
    id: "taller-medicina-agosto",
    title: "Taller de Anatomía",
    description: "Taller práctico de anatomía humana",
    start: setMinutes(setHours(new Date(2025, 7, 12), 9), 0), // 12 agosto 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 12), 12), 0), // 12 agosto 2025, 12:00 PM
    allDay: false,
    color: "red",
    location: "Laboratorio de Anatomía",
    sede: "sede-central",
    facultad: "medicina",
    programa: "medicina",
  },
  {
    id: "presentacion-administracion-agosto",
    title: "Presentación de Casos Empresariales",
    description: "Estudiantes presentan análisis de casos reales",
    start: setMinutes(setHours(new Date(2025, 7, 15), 10), 0), // 15 agosto 2025, 10:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 15), 12), 0), // 15 agosto 2025, 12:00 PM
    allDay: false,
    color: "orange",
    location: "Aula 205 - Facultad de Administración",
    sede: "sede-central",
    facultad: "administracion",
    programa: "administracion-empresas",
  },
  {
    id: "simulacro-derecho-agosto",
    title: "Simulacro de Juicio",
    description: "Práctica de litigación y argumentación jurídica",
    start: setMinutes(setHours(new Date(2025, 7, 19), 14), 0), // 19 agosto 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 19), 17), 0), // 19 agosto 2025, 5:00 PM
    allDay: false,
    color: "purple",
    location: "Sala de Audiencias - Facultad de Derecho",
    sede: "sede-central",
    facultad: "derecho",
    programa: "derecho",
  },
  {
    id: "practica-psicologia-agosto",
    title: "Práctica Clínica - Psicología",
    description: "Sesión de práctica con pacientes bajo supervisión",
    start: setMinutes(setHours(new Date(2025, 7, 22), 8), 0), // 22 agosto 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 7, 22), 11), 0), // 22 agosto 2025, 11:00 AM
    allDay: false,
    color: "pink",
    location: "Clínica Universitaria",
    sede: "sede-norte",
    facultad: "psicologia",
    programa: "psicologia",
  },
  {
    id: "examen-parcial-agosto",
    title: "Examen Parcial - Cálculo II",
    description: "Evaluación parcial de la materia de cálculo",
    start: setMinutes(setHours(new Date(2025, 7, 26), 14), 0), // 26 agosto 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 26), 16), 0), // 26 agosto 2025, 4:00 PM
    allDay: false,
    color: "red",
    location: "Aula Múltiple",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-industrial",
  },
  {
    id: "proyecto-final-sistemas",
    title: "Entrega Proyecto Final",
    description: "Presentación de proyectos finales de grado",
    start: setMinutes(setHours(new Date(2025, 7, 30), 14), 0), // 30 agosto 2025, 2:00 PM
    end: setMinutes(setHours(new Date(2025, 7, 30), 18), 0), // 30 agosto 2025, 6:00 PM
    allDay: false,
    color: "purple",
    location: "Auditorio de Ingeniería",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-sistemas",
  },
  {
    id: "seminario-ia-sistemas",
    title: "Seminario: IA en Ingeniería",
    description: "Seminario especializado sobre aplicaciones de IA",
    start: setMinutes(setHours(new Date(2025, 8, 12), 16), 0), // 12 septiembre 2025, 4:00 PM
    end: setMinutes(setHours(new Date(2025, 8, 12), 18), 0), // 12 septiembre 2025, 6:00 PM
    allDay: false,
    color: "green",
    location: "Laboratorio de IA",
    sede: "sede-central",
    facultad: "ingenieria",
    programa: "ingenieria-sistemas",
  },
  {
    id: "practica-laboratorio-psicologia",
    title: "Práctica de Laboratorio",
    description: "Sesión práctica de psicología experimental",
    start: setMinutes(
      setHours(addDays(currentDate, -4 + daysUntilNextMonday), 10),
      0,
    ),
    end: setMinutes(
      setHours(addDays(currentDate, -4 + daysUntilNextMonday), 12),
      0,
    ),
    color: "orange",
    location: "Laboratorio de Psicología",
    sede: "sede-norte",
    facultad: "ciencias",
    programa: "psicologia",
  },
  {
    id: "examen-parcial-administracion",
    title: "Examen Parcial - Gestión",
    description: "Evaluación parcial de gestión empresarial",
    start: setMinutes(setHours(new Date(2025, 8, 25), 8), 0), // 25 septiembre 2025, 8:00 AM
    end: setMinutes(setHours(new Date(2025, 8, 25), 10), 0), // 25 septiembre 2025, 10:00 AM
    allDay: false,
    color: "pink",
    location: "Aula Magna - Administración",
    sede: "sede-sur",
    facultad: "administracion",
    programa: "administracion-empresas",
  },
  {
    id: "visita-empresa-industrial",
    title: "Visita Empresa Industrial",
    description: "Visita técnica a planta industrial",
    start: setMinutes(setHours(new Date(2025, 9, 8), 7), 0), // 8 octubre 2025, 7:00 AM
    end: setMinutes(setHours(new Date(2025, 9, 8), 17), 0), // 8 octubre 2025, 5:00 PM
    allDay: false,
    color: "blue",
    location: "Planta Industrial XYZ",
    sede: "sede-este",
    facultad: "ingenieria",
    programa: "ingenieria-industrial",
  },
  {
    id: "sustentacion-tesis-derecho",
    title: "Sustentación de Tesis",
    description: "Defensa de tesis de grado en derecho",
    start: setMinutes(setHours(new Date(2025, 9, 22), 9), 0), // 22 octubre 2025, 9:00 AM
    end: setMinutes(setHours(new Date(2025, 9, 22), 11), 0), // 22 octubre 2025, 11:00 AM
    allDay: false,
    color: "purple",
    location: "Sala de Jurados - Facultad de Derecho",
    sede: "sede-central",
    facultad: "derecho",
    programa: "derecho",
  },
  {
    id: "congreso-medicina-estudiantes",
    title: "Congreso Estudiantil de Medicina",
    description: "Congreso anual organizado por estudiantes",
    start: new Date(2025, 10, 15), // 15 noviembre 2025
    end: new Date(2025, 10, 17), // 17 noviembre 2025
    allDay: true,
    color: "green",
    location: "Centro de Convenciones Médicas",
    sede: "sede-central",
    facultad: "ciencias",
    programa: "medicina",
  },
]

// Etiquetas específicas para calendario de programa
const programaEtiquettes: Etiquette[] = [
  {
    id: "clases",
    name: "Clases",
    color: "blue",
    isActive: true,
  },
  {
    id: "laboratorios",
    name: "Laboratorios",
    color: "purple",
    isActive: true,
  },
  {
    id: "examenes",
    name: "Exámenes",
    color: "pink",
    isActive: true,
  },
  {
    id: "induccion",
    name: "Inducción",
    color: "green",
    isActive: true,
  },
  {
    id: "presentaciones",
    name: "Presentaciones",
    color: "orange",
    isActive: true,
  },
  {
    id: "actividades-externas",
    name: "Actividades Externas",
    color: "red",
    isActive: true,
  },
  {
    id: "sin-etiqueta",
    name: "Sin Etiqueta",
    color: "gray",
    isActive: true,
  },
]

interface ProgramaCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
  _programName?: string
}

export default function ProgramaCalendar({
  userRole = "user",
}: ProgramaCalendarProps) {
  const calendar = useCalendarManager("programa")
  const initializationExecuted = useRef(false)

  // Initialize etiquettes only once
  useEffect(() => {
    if (!initializationExecuted.current) {
      calendar.setCalendarEtiquettes(programaEtiquettes)
      initializationExecuted.current = true
    }
  }, [calendar])

  // Calculate permissions based on user role
  const calendarType = "facultad" // programa uses facultad type permissions
  const permissions = useCalendarPermissions(calendarType, userRole)

  // Filter events based on academic filters and etiquette visibility
  const visibleEvents = useMemo(() => {
    return programaEvents.filter((event) => {
      // Apply academic filters with cumulative logic (ALL active filters must match)
      const { sede, facultad, programa } = calendar.academicFilters

      // All active filters must match (cumulative filtering)
      if (sede && event.sede && event.sede !== sede) return false
      if (facultad && event.facultad && event.facultad !== facultad)
        return false
      if (programa && event.programa && event.programa !== programa)
        return false

      // Apply etiquette visibility
      return calendar.isEtiquetteVisible(event.color)
    })
  }, [calendar])

  // Event handlers
  const handleEventAdd = (event: CalendarEvent) => {
    // TODO: Implement event addition logic
    console.log("Adding event:", event)
  }

  const handleEventUpdate = (event: CalendarEvent) => {
    // TODO: Implement event update logic
    console.log("Updating event:", event)
  }

  const handleEventDelete = (eventId: string) => {
    // TODO: Implement event deletion logic
    console.log("Deleting event:", eventId)
  }

  return (
    <>
      <EtiquettesHeader
        etiquettes={programaEtiquettes}
        isEtiquetteVisible={calendar.isEtiquetteVisible}
        toggleEtiquetteVisibility={calendar.toggleEtiquetteVisibility}
      />
      <SetupCalendar
        events={visibleEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView="week"
        editable={true}
        permissions={permissions}
        customEtiquettes={programaEtiquettes} // ← Pasar etiquetas específicas del calendario de programa
      />
    </>
  )
}
