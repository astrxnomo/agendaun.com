"use client"

import { useMemo } from "react"

import { useTutoringEvents } from "@/components/calendar/hooks/use-tutoring-events"
import { TutoringCalendar } from "@/components/calendar/schedules/tutoring-calendar"
import { ScheduleListView } from "@/components/schedule-list-view"
import { ScheduleStats } from "@/components/schedule-stats"

import type { CalendarEvent, TutoringEvent } from "@/components/calendar/types"

// 🎯 Adaptador para usar TutoringCalendar en SchedulePageLayout
interface TutoringCalendarAdapterProps {
  events: CalendarEvent[] // Propiedad requerida por SchedulePageLayout (pero ignorada)

  // Props específicas para monitorías
  enableStats?: boolean
  enableLegend?: boolean
  initialView?: "month" | "week" | "day" | "agenda"
  weeksToGenerate?: number
  filters?: {
    levels?: string[]
    types?: string[]
    subjects?: string[]
    tutors?: string[]
    departments?: string[]
    status?: string[]
    showOnlyAvailable?: boolean
  }

  // Callbacks
  onTutoringSessionSelect?: (session: TutoringEvent) => void
}

export function TutoringCalendarAdapter({
  events: _ignored, // Ignoramos los eventos pasados por SchedulePageLayout
  enableStats = true,
  enableLegend = true,
  initialView = "week",
  weeksToGenerate = 6,
  filters = {},
  onTutoringSessionSelect,
}: TutoringCalendarAdapterProps) {
  return (
    <TutoringCalendar
      enableStats={enableStats}
      enableLegend={enableLegend}
      initialView={initialView}
      weeksToGenerate={weeksToGenerate}
      filters={filters}
      onTutoringSessionSelect={onTutoringSessionSelect}
    />
  )
}

// 🎯 Componente de lista optimizado para monitorías
interface TutoringListAdapterProps {
  events: CalendarEvent[]
}

export function TutoringListAdapter({
  events: _ignored,
}: TutoringListAdapterProps) {
  // Usar los eventos generados por el hook interno
  const tutoringEvents = useTutoringEvents(undefined, 4)

  // Convertir a CalendarEvent para compatibilidad
  const calendarEvents = useMemo(() => {
    return tutoringEvents.map((event) => ({
      ...event,
      metadata: {
        ...event.metadata,
        // Asegurar compatibilidad con el formato esperado
      },
    }))
  }, [tutoringEvents])

  return <ScheduleListView events={calendarEvents} />
}

// 🎯 Componente de estadísticas optimizado para monitorías
interface TutoringStatsAdapterProps {
  events: CalendarEvent[]
}

export function TutoringStatsAdapter({
  events: _ignored,
}: TutoringStatsAdapterProps) {
  // Usar los eventos generados por el hook interno
  const tutoringEvents = useTutoringEvents(undefined, 4)

  // Convertir a CalendarEvent para compatibilidad
  const calendarEvents = useMemo(() => {
    return tutoringEvents.map((event) => ({
      ...event,
      metadata: {
        ...event.metadata,
        // Asegurar compatibilidad con el formato esperado
      },
    }))
  }, [tutoringEvents])

  return <ScheduleStats events={calendarEvents} />
}
