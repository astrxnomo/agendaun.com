/**
 * @fileoverview Enhanced Universal Calendar
 * @description Componente de calendario mejorado con manejo inteligente de datos
 * @category Calendar Components
 */

"use client"

import { Suspense, useMemo } from "react"

import {
  AgendaView,
  DayView,
  EtiquettesHeader,
  MonthView,
  WeekView,
} from "@/components/calendar"
import { useCalendarContext } from "@/components/calendar/calendar-context"
import { useSmartCalendar } from "@/components/calendar/hooks/use-smart-calendar"
import { CalendarSkeleton } from "@/components/skeletons/calendar-loading"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { Calendars, Events } from "@/types"

// ===== TYPES =====

interface EnhancedCalendarProps {
  calendar: Calendars
  defaultView?: "agenda" | "month" | "week" | "day"
  showHeader?: boolean
  showEtiquettes?: boolean
  showStats?: boolean
  enableFilters?: boolean
  enableRealTime?: boolean
  className?: string
}

// ===== MAIN COMPONENT =====

export default function EnhancedCalendar({
  calendar,
  defaultView = "month",
  showHeader = true,
  showEtiquettes = true,
  showStats = false,
  enableFilters = true,
  enableRealTime = true,
  className = "",
}: EnhancedCalendarProps) {
  // ===== SMART CALENDAR HOOK =====

  const smartCalendar = useSmartCalendar({
    calendar,
    autoApplyFilters: enableFilters,
    enableRealTimeSync: enableRealTime,
    preloadData: true,
  })

  // ===== CONTEXT ACCESS =====

  const calendarContext = useCalendarContext()

  // ===== DERIVED STATE =====

  const stats = useMemo(() => {
    if (!showStats) return null
    return smartCalendar.utils.getEventsStats()
  }, [smartCalendar.utils, showStats])

  // ===== RENDER FUNCTIONS =====

  const renderCalendarView = () => {
    const viewProps = {
      currentDate: calendarContext.currentDate,
      events: smartCalendar.visibleEvents,
      etiquettes: smartCalendar.etiquettes,
      onEventSelect: (event: Events) => {
        // Aquí se podría abrir un modal de evento
        console.log("Event selected:", event)
      },
      onEventCreate: (date: Date) => {
        console.log("Create event on date:", date)
      },
    }

    switch (defaultView) {
      case "agenda":
        return <AgendaView {...viewProps} />
      case "day":
        return <DayView {...viewProps} />
      case "week":
        return <WeekView {...viewProps} />
      case "month":
      default:
        return <MonthView {...viewProps} />
    }
  }

  const renderHeader = () => {
    if (!showHeader) return null

    return (
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              {calendar.name || "Calendario"}
            </CardTitle>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <span>Tipo: {smartCalendar.calendarType}</span>
              {smartCalendar.hasAcademicFilters && (
                <span>• Filtros activos</span>
              )}
              <span>• {smartCalendar.visibleEvents.length} eventos</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={smartCalendar.actions.refresh}
              disabled={smartCalendar.isLoading}
            >
              {smartCalendar.isLoading ? "Cargando..." : "Actualizar"}
            </Button>
          </div>
        </div>
      </CardHeader>
    )
  }

  const renderEtiquettes = () => {
    if (!showEtiquettes || smartCalendar.etiquettes.length === 0) return null

    return (
      <div className="px-6 pb-4">
        <EtiquettesHeader
          etiquettes={smartCalendar.etiquettes}
          isEtiquetteVisible={(color) =>
            calendarContext.isEtiquetteVisible(calendar.slug as any, color)
          }
          toggleEtiquetteVisibility={smartCalendar.actions.toggleEtiquette}
          etiquettesManager={null}
        />
      </div>
    )
  }

  const renderStats = () => {
    if (!showStats || !stats) return null

    return (
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div className="text-center">
            <div className="text-lg font-semibold">{stats.total}</div>
            <div className="text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{stats.upcoming}</div>
            <div className="text-muted-foreground">Próximos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{stats.past}</div>
            <div className="text-muted-foreground">Pasados</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {Object.keys(stats.byEtiquette).length}
            </div>
            <div className="text-muted-foreground">Etiquetas</div>
          </div>
        </div>
      </div>
    )
  }

  const renderError = () => {
    if (!smartCalendar.error) return null

    return (
      <Alert variant="destructive" className="mx-6 mb-4">
        <AlertDescription>
          Error al cargar el calendario: {smartCalendar.error}
          <Button
            variant="link"
            size="sm"
            onClick={smartCalendar.actions.refresh}
            className="ml-2 h-auto p-0"
          >
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const renderFilterStatus = () => {
    if (!smartCalendar.hasAcademicFilters) return null

    return (
      <div className="px-6 pb-4">
        <div className="text-muted-foreground text-sm">
          <strong>Filtros aplicados:</strong>
          {Object.entries(smartCalendar.appliedFilters).map(([key, value]) => (
            <span key={key} className="ml-2 font-medium">
              {key}: {value}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // ===== LOADING STATE =====

  if (smartCalendar.isLoading) {
    return (
      <Card className={className}>
        {renderHeader()}
        <CardContent>
          <CalendarSkeleton />
        </CardContent>
      </Card>
    )
  }

  // ===== MAIN RENDER =====

  return (
    <Card className={className}>
      {renderHeader()}
      {renderError()}
      {renderFilterStatus()}
      {renderStats()}
      {renderEtiquettes()}

      <CardContent className="pt-0">
        <Suspense fallback={<CalendarSkeleton />}>
          {renderCalendarView()}
        </Suspense>
      </CardContent>
    </Card>
  )
}

// ===== EXPORT VARIANTS =====

/**
 * Variante compacta del calendario
 */
export function CompactCalendar({ calendar, ...props }: EnhancedCalendarProps) {
  return (
    <EnhancedCalendar
      {...props}
      calendar={calendar}
      showHeader={false}
      showStats={false}
      className="border-none shadow-none"
    />
  )
}

/**
 * Variante con estadísticas del calendario
 */
export function StatsCalendar({ calendar, ...props }: EnhancedCalendarProps) {
  return (
    <EnhancedCalendar
      {...props}
      calendar={calendar}
      showStats={true}
      showEtiquettes={true}
    />
  )
}

/**
 * Variante minimal del calendario
 */
export function MinimalCalendar({ calendar, ...props }: EnhancedCalendarProps) {
  return (
    <EnhancedCalendar
      {...props}
      calendar={calendar}
      showHeader={false}
      showEtiquettes={false}
      showStats={false}
      enableFilters={false}
      className="border-none shadow-none"
    />
  )
}
