"use client"

import { useMemo } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import {
  useFilteredTutoringEvents,
  useTutoringEvents,
} from "../hooks/use-tutoring-events"
import { WrappedEventCalendar } from "../wrapped-event-calendar"

import type { CalendarEvent, EventColor, TutoringEvent } from "../types"

// 🎯 Interface para datos personalizados de sesiones
interface CustomTutoringSession {
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

// 🎯 Props optimizadas para el calendario de monitorías
interface TutoringCalendarProps {
  // Callbacks de eventos
  onTutoringSessionSelect?: (session: TutoringEvent) => void
  onEventAdd?: (event: TutoringEvent) => void
  onEventUpdate?: (event: TutoringEvent) => void
  onEventDelete?: (eventId: string) => void

  // Configuración de vista
  initialView?: "month" | "week" | "day" | "agenda"
  enableLegend?: boolean
  enableStats?: boolean

  // Filtros específicos de monitorías (adicionales a los filtros universitarios)
  filters?: {
    levels?: string[]
    types?: string[]
    subjects?: string[]
    tutors?: string[]
    departments?: string[]
    status?: string[]
    showOnlyAvailable?: boolean
  }

  // Configuración de datos
  weeksToGenerate?: number
  customSessions?: CustomTutoringSession[] // Para datos personalizados
}

// 🎯 Componente de estadísticas de monitorías
function TutoringStats({ events }: { events: TutoringEvent[] }) {
  const stats = useMemo(() => {
    const total = events.length
    const available = events.filter(
      (e) => e.metadata.status === "available",
    ).length
    const full = events.filter((e) => e.metadata.status === "full").length

    const totalCapacity = events.reduce(
      (sum, e) => sum + (e.metadata.capacity || 0),
      0,
    )
    const totalEnrolled = events.reduce(
      (sum, e) => sum + (e.metadata.enrolledCount || 0),
      0,
    )
    const occupancyRate =
      totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0

    // Distribución por nivel
    const levelCounts = events.reduce(
      (acc, e) => {
        acc[e.metadata.tutoringLevel] = (acc[e.metadata.tutoringLevel] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Distribución por tipo
    const typeCounts = events.reduce(
      (acc, e) => {
        acc[e.metadata.tutoringType] = (acc[e.metadata.tutoringType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total,
      available,
      full,
      occupancyRate: Math.round(occupancyRate),
      levelCounts,
      typeCounts,
    }
  }, [events])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Estadísticas de Monitorías
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumen general */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-muted-foreground text-xs">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {stats.available}
            </div>
            <div className="text-muted-foreground text-xs">Disponibles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{stats.full}</div>
            <div className="text-muted-foreground text-xs">Llenas</div>
          </div>
        </div>

        {/* Tasa de ocupación */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Ocupación General</span>
            <span>{stats.occupancyRate}%</span>
          </div>
          <Progress value={stats.occupancyRate} className="h-2" />
        </div>

        {/* Distribución por nivel */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Por Nivel</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(stats.levelCounts).map(([level, count]) => (
              <Badge key={level} variant="outline" className="text-xs">
                {level}: {count}
              </Badge>
            ))}
          </div>
        </div>

        {/* Distribución por tipo */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Por Tipo</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(stats.typeCounts).map(([type, count]) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 🎯 Componente de leyenda optimizada
function TutoringLegend() {
  const legendItems = [
    {
      color: "bg-blue-500",
      label: "Básico",
      description: "Nivel introductorio",
    },
    { color: "bg-orange-500", label: "Intermedio", description: "Nivel medio" },
    {
      color: "bg-purple-500",
      label: "Avanzado",
      description: "Nivel superior",
    },
    {
      color: "bg-emerald-500",
      label: "Grupal",
      description: "Múltiples estudiantes",
    },
    { color: "bg-violet-500", label: "Taller", description: "Sesión práctica" },
    {
      color: "bg-rose-500",
      label: "Lleno",
      description: "Sin cupos disponibles",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Leyenda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded ${item.color}`} />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-muted-foreground">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// 🎯 Componente principal optimizado
export function TutoringCalendar({
  onTutoringSessionSelect,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = "week",
  enableLegend = true,
  enableStats = true,
  filters = {},
  weeksToGenerate = 4,
  customSessions,
}: TutoringCalendarProps) {
  // Generar eventos base
  const allEvents = useTutoringEvents(customSessions, weeksToGenerate)

  // Aplicar filtros específicos de monitorías
  const filteredEvents = useFilteredTutoringEvents(allEvents, filters)

  // Convertir a eventos de calendario estándar para el componente
  const calendarEvents = useMemo(() => {
    return filteredEvents.map((event) => ({
      ...event,
      // Asegurar compatibilidad con WrappedEventCalendar
      metadata: {
        ...event.metadata,
        // Convertir metadatos específicos a formato estándar si es necesario
      },
    }))
  }, [filteredEvents])

  // 🎯 Adaptadores para callbacks (TutoringEvent -> CalendarEvent)
  const handleEventSelect = useMemo(() => {
    if (!onTutoringSessionSelect) return undefined
    return (event: CalendarEvent) => {
      // Verificamos que el evento tenga metadata de monitoría antes del cast
      if (event.metadata.eventType === "tutoring") {
        onTutoringSessionSelect(event as unknown as TutoringEvent)
      }
    }
  }, [onTutoringSessionSelect])

  const handleEventAdd = useMemo(() => {
    if (!onEventAdd) return undefined
    return (event: CalendarEvent) => {
      // Para eventos nuevos, convertimos a TutoringEvent
      if (event.metadata.eventType === "tutoring") {
        onEventAdd(event as unknown as TutoringEvent)
      }
    }
  }, [onEventAdd])

  const handleEventUpdate = useMemo(() => {
    if (!onEventUpdate) return undefined
    return (event: CalendarEvent) => {
      // Para actualizaciones, verificamos el tipo
      if (event.metadata.eventType === "tutoring") {
        onEventUpdate(event as unknown as TutoringEvent)
      }
    }
  }, [onEventUpdate])

  return (
    <div className="space-y-4">
      {/* Estadísticas y leyenda */}
      {(enableStats || enableLegend) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enableStats && <TutoringStats events={filteredEvents} />}
          {enableLegend && <TutoringLegend />}
        </div>
      )}

      {/* Calendario principal */}
      <WrappedEventCalendar
        events={calendarEvents}
        onEventSelect={handleEventSelect}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={onEventDelete}
        initialView={initialView}
      />
    </div>
  )
}
