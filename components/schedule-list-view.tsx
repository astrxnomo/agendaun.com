"use client"

import {
  Building,
  CalendarDays,
  Clock,
  GraduationCap,
  MapPin,
  User,
} from "lucide-react"
import { memo } from "react"

import { type CalendarEvent } from "@/components/calendar/types"
import { formatDate, formatTime } from "@/components/calendar/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ScheduleListViewProps {
  events: CalendarEvent[]
  onEventSelect?: (event: CalendarEvent) => void
  showCampusInfo?: boolean
  groupByDate?: boolean
  className?: string
}

// Componente para evento individual
const EventListItem = memo(
  ({
    event,
    onSelect,
    showCampusInfo = true,
  }: {
    event: CalendarEvent
    onSelect?: (event: CalendarEvent) => void
    showCampusInfo?: boolean
  }) => {
    const startTime = formatTime(event.start)
    const endTime = formatTime(event.end)
    const date = formatDate(event.start)

    return (
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            {/* Información principal */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-2">
                <h3 className="text-sm leading-tight font-medium">
                  {event.title}
                </h3>
                {event.color && (
                  <div
                    className="mt-0.5 h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: `var(--${event.color}-500)` }}
                  />
                )}
              </div>

              {event.description && (
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {event.description}
                </p>
              )}

              {/* Metadata del evento */}
              <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>{date}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {startTime} - {endTime}
                  </span>
                </div>

                {event.metadata?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.metadata.location}</span>
                  </div>
                )}

                {event.metadata?.instructor && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{event.metadata.instructor}</span>
                  </div>
                )}
              </div>

              {/* Información universitaria */}
              {showCampusInfo && event.metadata && (
                <div className="flex flex-wrap gap-1">
                  {event.metadata.campusId && (
                    <Badge variant="outline" className="px-2 py-0 text-xs">
                      <Building className="mr-1 h-3 w-3" />
                      {event.metadata.campusId.toUpperCase()}
                    </Badge>
                  )}

                  {event.metadata.facultyId && (
                    <Badge variant="outline" className="px-2 py-0 text-xs">
                      <GraduationCap className="mr-1 h-3 w-3" />
                      {event.metadata.facultyId.split("-")[1]?.toUpperCase()}
                    </Badge>
                  )}

                  {event.metadata.eventType && (
                    <Badge variant="secondary" className="px-2 py-0 text-xs">
                      {event.metadata.eventType}
                    </Badge>
                  )}

                  {event.metadata.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="px-2 py-0 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-2">
              {onSelect && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(event)}
                  className="text-xs"
                >
                  Ver detalles
                </Button>
              )}

              {/* Indicador de capacidad si está disponible */}
              {event.metadata?.capacity && (
                <div className="text-muted-foreground text-center text-xs">
                  <div className="text-xs">
                    {event.metadata.enrolledCount || 0}/
                    {event.metadata.capacity}
                  </div>
                  <div className="text-[10px]">disponible</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  },
)

EventListItem.displayName = "EventListItem"

// Componente principal de lista
export const ScheduleListView = memo(
  ({
    events,
    onEventSelect,
    showCampusInfo = true,
    groupByDate = true,
    className = "",
  }: ScheduleListViewProps) => {
    if (events.length === 0) {
      return (
        <div
          className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
        >
          <CalendarDays className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-medium">No hay eventos</h3>
          <p className="text-muted-foreground max-w-sm">
            No se encontraron eventos para mostrar con los filtros actuales.
          </p>
        </div>
      )
    }

    if (!groupByDate) {
      return (
        <div className={`space-y-3 p-4 ${className}`}>
          {events.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onSelect={onEventSelect}
              showCampusInfo={showCampusInfo}
            />
          ))}
        </div>
      )
    }

    // Agrupar eventos por fecha
    const eventsByDate = events.reduce(
      (acc, event) => {
        const dateKey = formatDate(event.start)
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(event)
        return acc
      },
      {} as Record<string, CalendarEvent[]>,
    )

    // Ordenar fechas
    const sortedDates = Object.keys(eventsByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    )

    return (
      <div className={`space-y-6 p-4 ${className}`}>
        {sortedDates.map((date) => (
          <div key={date} className="space-y-3">
            {/* Header de fecha */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{date}</h3>
              <Separator className="flex-1" />
              <Badge variant="secondary" className="text-xs">
                {eventsByDate[date].length} evento
                {eventsByDate[date].length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {/* Eventos del día */}
            <div className="space-y-3">
              {eventsByDate[date]
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .map((event) => (
                  <EventListItem
                    key={event.id}
                    event={event}
                    onSelect={onEventSelect}
                    showCampusInfo={showCampusInfo}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
)

ScheduleListView.displayName = "ScheduleListView"
