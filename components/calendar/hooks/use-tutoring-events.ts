import { useMemo } from "react"

import type { EventColor, TutoringEvent, TutoringEventMetadata } from "../types"

// 🎯 Datos base para monitorías - Estructura optimizada
interface TutoringSessionBase {
  subject: string
  tutor: string
  tutorId: string
  department: string
  campus: string
  faculty: string
  program: string
  level: "basic" | "intermediate" | "advanced"
  type: "individual" | "group" | "workshop"
  capacity: number
  color: EventColor
  schedules: Array<{ day: number; hour: number }>
  requirements?: string[]
  topics: string[]
  cost?: number
}

// 🎯 Hook optimizado para generar eventos de monitorías
export function useTutoringEvents(
  sessionsData?: TutoringSessionBase[],
  weeksToGenerate = 4,
): TutoringEvent[] {
  return useMemo(() => {
    const now = new Date()
    const events: TutoringEvent[] = []

    // Datos por defecto si no se proporcionan
    const defaultSessions: TutoringSessionBase[] = [
      {
        subject: "Cálculo Diferencial",
        tutor: "Andrea Pérez",
        tutorId: "tutor-001",
        department: "Matemáticas",
        campus: "bog",
        faculty: "bog-cie",
        program: "bog-cie-mat",
        level: "basic",
        type: "group",
        capacity: 15,
        color: "blue",
        schedules: [
          { day: 1, hour: 14 }, // Lunes 14:00-16:00
          { day: 3, hour: 14 }, // Miércoles 14:00-16:00
        ],
        topics: ["Límites", "Derivadas", "Aplicaciones"],
        requirements: ["Álgebra básica", "Trigonometría"],
      },
      {
        subject: "Física I - Mecánica",
        tutor: "Carlos Rodríguez",
        tutorId: "tutor-002",
        department: "Física",
        campus: "bog",
        faculty: "bog-cie",
        program: "bog-cie-fis",
        level: "basic",
        type: "group",
        capacity: 12,
        color: "emerald",
        schedules: [
          { day: 2, hour: 16 }, // Martes 16:00-18:00
          { day: 4, hour: 16 }, // Jueves 16:00-18:00
        ],
        topics: ["Cinemática", "Dinámica", "Energía"],
        requirements: ["Física básica", "Cálculo I"],
      },
      {
        subject: "Programación I - Java",
        tutor: "María González",
        tutorId: "tutor-003",
        department: "Ingeniería de Sistemas",
        campus: "bog",
        faculty: "bog-ing",
        program: "bog-ing-sis",
        level: "intermediate",
        type: "workshop",
        capacity: 20,
        color: "violet",
        schedules: [
          { day: 1, hour: 10 }, // Lunes 10:00-12:00
          { day: 3, hour: 10 }, // Miércoles 10:00-12:00
          { day: 5, hour: 10 }, // Viernes 10:00-12:00
        ],
        topics: ["POO", "Estructuras de datos", "Algoritmos"],
        requirements: ["Lógica de programación"],
      },
      {
        subject: "Química Orgánica",
        tutor: "Ana López",
        tutorId: "tutor-004",
        department: "Química",
        campus: "bog",
        faculty: "bog-cie",
        program: "bog-cie-qui",
        level: "intermediate",
        type: "group",
        capacity: 10,
        color: "orange",
        schedules: [
          { day: 2, hour: 14 }, // Martes 14:00-16:00
          { day: 4, hour: 14 }, // Jueves 14:00-16:00
        ],
        topics: ["Nomenclatura", "Reacciones", "Mecanismos"],
        requirements: ["Química General"],
      },
      {
        subject: "Álgebra Lineal",
        tutor: "David Martínez",
        tutorId: "tutor-005",
        department: "Matemáticas",
        campus: "bog",
        faculty: "bog-cie",
        program: "bog-cie-mat",
        level: "intermediate",
        type: "group",
        capacity: 18,
        color: "teal",
        schedules: [
          { day: 1, hour: 16 }, // Lunes 16:00-18:00
          { day: 5, hour: 14 }, // Viernes 14:00-16:00
        ],
        topics: ["Vectores", "Matrices", "Sistemas lineales"],
        requirements: ["Cálculo I"],
      },
      {
        subject: "Estadística Aplicada",
        tutor: "Laura Fernández",
        tutorId: "tutor-006",
        department: "Estadística",
        campus: "bog",
        faculty: "bog-cie",
        program: "bog-cie-est",
        level: "advanced",
        type: "group",
        capacity: 8,
        color: "purple",
        schedules: [{ day: 3, hour: 16 }], // Miércoles 16:00-18:00
        topics: ["Regresión", "ANOVA", "Modelos"],
        requirements: ["Estadística básica", "Probabilidad"],
        cost: 25000,
      },
      {
        subject: "Bases de Datos",
        tutor: "Roberto Silva",
        tutorId: "tutor-007",
        department: "Ingeniería de Sistemas",
        campus: "bog",
        faculty: "bog-ing",
        program: "bog-ing-sis",
        level: "advanced",
        type: "group",
        capacity: 15,
        color: "indigo",
        schedules: [
          { day: 2, hour: 10 }, // Martes 10:00-12:00
          { day: 4, hour: 10 }, // Jueves 10:00-12:00
        ],
        topics: ["SQL", "Normalización", "Optimización"],
        requirements: ["Programación II"],
        cost: 30000,
      },
    ]

    const sessions = sessionsData || defaultSessions

    // Generar eventos para las semanas especificadas
    for (let week = 0; week < weeksToGenerate; week++) {
      sessions.forEach((session, index) => {
        session.schedules.forEach((schedule) => {
          const date = new Date(now)
          date.setDate(date.getDate() + week * 7 + schedule.day - now.getDay())

          const startDate = new Date(date)
          startDate.setHours(schedule.hour, 0, 0, 0)
          const endDate = new Date(date)
          endDate.setHours(schedule.hour + 2, 0, 0, 0) // 2 horas de duración

          // Simular ocupación realista
          const enrolledCount =
            Math.floor(Math.random() * session.capacity * 0.8) +
            Math.floor(session.capacity * 0.2)

          // Determinar estado
          const status =
            enrolledCount >= session.capacity ? "full" : "available"
          const waitingList =
            status === "full" ? Math.floor(Math.random() * 5) : 0

          // Construir metadatos optimizados
          const metadata: TutoringEventMetadata = {
            // 🏛️ Filtros principales
            campusId: session.campus,
            facultyId: session.faculty,
            studyProgramId: session.program,

            // 📚 Información del evento
            eventType: "tutoring",
            eventCode: `MON-${session.subject.replace(/\s+/g, "").substring(0, 6).toUpperCase()}`,
            academicLevel: "undergraduate",
            semester: 1,
            academicYear: 2024,

            // 👨‍🏫 Información específica de monitoría
            tutor: session.tutor,
            tutorId: session.tutorId,
            department: session.department,
            subject: session.subject,
            tutoringLevel: session.level,
            tutoringType: session.type,

            // 📍 Ubicación
            location: `Sala de Estudio ${Math.floor(Math.random() * 20) + 1}, Edificio ${session.department}`,
            building: `Edificio ${session.department}`,

            // 📊 Capacidad y ocupación
            capacity: session.capacity,
            enrolledCount: enrolledCount,
            waitingList: waitingList,
            isOpen: status === "available",

            // 🏷️ Tags optimizados
            tags: [
              "monitoría",
              session.subject.toLowerCase(),
              session.department.toLowerCase(),
              session.level,
              session.type,
              "estudio",
              "apoyo académico",
              ...session.topics.map((topic) => topic.toLowerCase()),
            ],

            // 📈 Métricas
            difficulty:
              session.level === "basic"
                ? 1
                : session.level === "intermediate"
                  ? 2
                  : 3,
            popularity: Math.floor((enrolledCount / session.capacity) * 100),

            // 🎯 Información específica de monitoría
            requirements: session.requirements,
            topics: session.topics,
            status,
            cost: session.cost || 0,
          }

          // Construir descripción rica
          const costText = session.cost
            ? `💰 $${session.cost.toLocaleString()}`
            : "🆓 Gratuito"
          const statusText = status === "full" ? "🔴 Lleno" : "🟢 Disponible"
          const typeText =
            session.type === "individual"
              ? "👤 Individual"
              : session.type === "group"
                ? "👥 Grupal"
                : "🏪 Taller"

          const description = [
            `${statusText} ${typeText}`,
            `📍 ${metadata.location}`,
            `👥 ${enrolledCount}/${session.capacity} estudiantes`,
            waitingList > 0 ? `⏳ ${waitingList} en lista de espera` : "",
            `🎓 Nivel: ${session.level}`,
            costText,
            `📚 Temas: ${session.topics.join(", ")}`,
            session.requirements
              ? `📋 Requisitos: ${session.requirements.join(", ")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n")

          events.push({
            id: `tutoring-${index}-${week}-${schedule.day}-${schedule.hour}`,
            title: `${session.subject}`,
            description,
            start: startDate,
            end: endDate,
            color: session.color,
            location: metadata.location,
            metadata,
          })
        })
      })
    }

    return events
  }, [sessionsData, weeksToGenerate])
}

// 🎯 Hook para filtrar eventos de monitorías
export function useFilteredTutoringEvents(
  events: TutoringEvent[],
  filters: {
    levels?: string[]
    types?: string[]
    subjects?: string[]
    tutors?: string[]
    departments?: string[]
    status?: string[]
    showOnlyAvailable?: boolean
  } = {},
): TutoringEvent[] {
  return useMemo(() => {
    let filtered = events

    // Filtrar por nivel
    if (filters.levels && filters.levels.length > 0) {
      filtered = filtered.filter((event) =>
        filters.levels!.includes(event.metadata.tutoringLevel),
      )
    }

    // Filtrar por tipo
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter((event) =>
        filters.types!.includes(event.metadata.tutoringType),
      )
    }

    // Filtrar por materia
    if (filters.subjects && filters.subjects.length > 0) {
      filtered = filtered.filter((event) =>
        filters.subjects!.some((subject) =>
          event.metadata.subject.toLowerCase().includes(subject.toLowerCase()),
        ),
      )
    }

    // Filtrar por tutor
    if (filters.tutors && filters.tutors.length > 0) {
      filtered = filtered.filter((event) =>
        filters.tutors!.includes(event.metadata.tutor),
      )
    }

    // Filtrar por departamento
    if (filters.departments && filters.departments.length > 0) {
      filtered = filtered.filter((event) =>
        filters.departments!.includes(event.metadata.department),
      )
    }

    // Filtrar por estado
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((event) =>
        filters.status!.includes(event.metadata.status),
      )
    }

    // Mostrar solo disponibles
    if (filters.showOnlyAvailable) {
      filtered = filtered.filter(
        (event) => event.metadata.status === "available",
      )
    }

    return filtered
  }, [events, filters])
}
