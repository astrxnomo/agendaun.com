"use client"

import { Calendar, List, RotateCcw } from "lucide-react"
import { memo, useState } from "react"

import { type CalendarEvent } from "@/components/calendar/types"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useFilteredEvents } from "@/hooks/use-filtered-events"

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

export interface SchedulePageLayoutProps {
  title: string
  description: string
  breadcrumbs: BreadcrumbItem[]
  events: CalendarEvent[]
  calendarComponent: React.ComponentType<{ events: CalendarEvent[] }>
  listComponent: React.ComponentType<{ events: CalendarEvent[] }>
  statsComponent?: React.ComponentType<{ events: CalendarEvent[] }>
  filterOptions?: {
    eventTypes?: string[]
    tags?: string[]
    instructors?: string[]
    locations?: string[]
  }
  className?: string
}

type ViewMode = "calendar" | "list"

export const SchedulePageLayout = memo(
  ({
    title,
    description,
    breadcrumbs,
    events,
    calendarComponent: CalendarComponent,
    listComponent: ListComponent,
    statsComponent: StatsComponent,
    filterOptions,
    className = "",
  }: SchedulePageLayoutProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>("calendar")

    // Usar el hook de filtros universitarios con filtros adicionales específicos
    const { filteredEvents, activeFiltersCount, filterSummary } =
      useFilteredEvents(events, {
        additionalFilters: filterOptions,
        enableUniversityFiltering: true,
        enableAdditionalFiltering: true,
      })

    const handleResetView = () => {
      setViewMode("calendar")
    }

    return (
      <div
        className={`flex flex-1 flex-col space-y-4 p-4 md:space-y-6 md:p-8 ${className}`}
      >
        <PageHeader breadcrumbs={breadcrumbs} />

        {/* Header con título y controles */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Información de filtros */}
            {activeFiltersCount > 0 && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>
                  {filteredEvents.length} de {filterSummary.total} eventos
                </span>
                {filterSummary.campus && (
                  <span className="bg-muted rounded px-2 py-1 text-xs">
                    {filterSummary.campus}
                  </span>
                )}
              </div>
            )}

            <Separator orientation="vertical" className="h-6" />

            {/* Controles de vista */}
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className="rounded-r-none"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendario
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="mr-2 h-4 w-4" />
                Lista
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetView}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Estadísticas opcionales */}
        {StatsComponent && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen</CardTitle>
              <CardDescription>
                Estadísticas de {filteredEvents.length} eventos
                {activeFiltersCount > 0 &&
                  ` (${activeFiltersCount} filtros activos)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatsComponent events={filteredEvents} />
            </CardContent>
          </Card>
        )}

        {/* Contenido principal */}
        <Card className="bg-background flex-1">
          <CardContent>
            {viewMode === "calendar" ? (
              <CalendarComponent events={filteredEvents} />
            ) : (
              <ListComponent events={filteredEvents} />
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="text-muted-foreground mb-4 h-8 w-8" />
              <h3 className="mb-2 text-lg font-medium">No hay eventos</h3>
              <p className="text-muted-foreground max-w-sm">
                {activeFiltersCount > 0
                  ? "No se encontraron eventos que coincidan con los filtros aplicados."
                  : "No hay eventos programados para mostrar."}
              </p>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleResetView}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Limpiar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  },
)

SchedulePageLayout.displayName = "SchedulePageLayout"
