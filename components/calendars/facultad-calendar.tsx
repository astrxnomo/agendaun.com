"use client"

import { setHours, setMinutes } from "date-fns"
import { useEffect, useMemo, useRef } from "react"

import {
  EtiquettesHeader,
  SetupCalendar,
  useCalendarManager,
  useCalendarPermissions,
  type CalendarEvent,
  type Etiquette,
} from "@/components/calendar"

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
    color: "lime",
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
  {
    id: "sin-etiqueta",
    name: "Sin etiqueta",
    color: "gray",
    isActive: true,
  },
]

interface FacultadCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
  editable?: boolean
}

export default function FacultadCalendar({
  userRole = "user",
  editable = false,
}: FacultadCalendarProps) {
  const calendar = useCalendarManager("facultad")
  const initializationExecuted = useRef(false)

  // Initialize etiquettes only once
  useEffect(() => {
    if (!initializationExecuted.current) {
      calendar.setCalendarEtiquettes(facultadEtiquettes)
      initializationExecuted.current = true
    }
  }, [calendar])

  // Calculate permissions based on user role
  const calendarType = "facultad"
  const permissions = useCalendarPermissions(calendarType, userRole)

  // Override editable if provided via props
  const isEditable = editable && permissions.canEdit

  // Filter events based on academic filters and etiquette visibility
  const visibleEvents = useMemo(() => {
    return facultadEvents.filter((event) => {
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
        etiquettes={facultadEtiquettes}
        isEtiquetteVisible={calendar.isEtiquetteVisible}
        toggleEtiquetteVisibility={calendar.toggleEtiquetteVisibility}
      />
      <SetupCalendar
        events={visibleEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView="month"
        editable={isEditable}
        permissions={permissions}
        customEtiquettes={facultadEtiquettes} // ← Pasar etiquetas específicas del calendario de facultad
      />
    </>
  )
}
