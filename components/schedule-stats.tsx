"use client"

import { Building, Calendar, Clock, TrendingUp, Users } from "lucide-react"
import { memo, useMemo } from "react"

import { type CalendarEvent } from "@/components/calendar/types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ScheduleStatsProps {
  events: CalendarEvent[]
  className?: string
}

export const ScheduleStats = memo(
  ({ events, className = "" }: ScheduleStatsProps) => {
    const stats = useMemo(() => {
      if (events.length === 0) {
        return {
          totalEvents: 0,
          totalHours: 0,
          averageEventDuration: 0,
          campusDistribution: {},
          eventTypeDistribution: {},
          dailyDistribution: {},
          capacityStats: { total: 0, enrolled: 0, available: 0 },
        }
      }

      // Estadísticas básicas
      const totalEvents = events.length
      const totalHours = events.reduce((acc, event) => {
        const duration =
          (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60)
        return acc + duration
      }, 0)
      const averageEventDuration = totalHours / totalEvents

      // Distribución por sede
      const campusDistribution = events.reduce(
        (acc, event) => {
          const campus = event.metadata?.campusId || "unknown"
          acc[campus] = (acc[campus] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      // Distribución por tipo de evento
      const eventTypeDistribution = events.reduce(
        (acc, event) => {
          const type = event.metadata?.eventType || "other"
          acc[type] = (acc[type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      // Distribución por día de la semana
      const dailyDistribution = events.reduce(
        (acc, event) => {
          const day = event.start.toLocaleDateString("es-ES", {
            weekday: "long",
          })
          acc[day] = (acc[day] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      // Estadísticas de capacidad
      const capacityStats = events.reduce(
        (acc, event) => {
          if (event.metadata?.capacity) {
            acc.total += event.metadata.capacity
            acc.enrolled += event.metadata.enrolledCount || 0
          }
          return acc
        },
        { total: 0, enrolled: 0, available: 0 },
      )

      capacityStats.available = capacityStats.total - capacityStats.enrolled

      return {
        totalEvents,
        totalHours,
        averageEventDuration,
        campusDistribution,
        eventTypeDistribution,
        dailyDistribution,
        capacityStats,
      }
    }, [events])

    if (events.length === 0) {
      return (
        <div className={`text-muted-foreground py-8 text-center ${className}`}>
          <Calendar className="mx-auto mb-4 h-8 w-8" />
          <p>No hay datos para mostrar estadísticas</p>
        </div>
      )
    }

    return (
      <div className={`space-y-6 ${className}`}>
        {/* Estadísticas generales */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1 text-center">
            <div className="text-primary text-2xl font-bold">
              {stats.totalEvents}
            </div>
            <div className="text-muted-foreground text-sm">Total Eventos</div>
          </div>

          <div className="space-y-1 text-center">
            <div className="text-primary text-2xl font-bold">
              {Math.round(stats.totalHours)}h
            </div>
            <div className="text-muted-foreground text-sm">Horas Total</div>
          </div>

          <div className="space-y-1 text-center">
            <div className="text-primary text-2xl font-bold">
              {Math.round(stats.averageEventDuration * 60)}min
            </div>
            <div className="text-muted-foreground text-sm">Promedio</div>
          </div>

          {stats.capacityStats.total > 0 && (
            <div className="space-y-1 text-center">
              <div className="text-primary text-2xl font-bold">
                {Math.round(
                  (stats.capacityStats.enrolled / stats.capacityStats.total) *
                    100,
                )}
                %
              </div>
              <div className="text-muted-foreground text-sm">Ocupación</div>
            </div>
          )}
        </div>

        {/* Distribución por sedes */}
        {Object.keys(stats.campusDistribution).length > 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building className="h-4 w-4" />
              Distribución por Sede
            </div>
            <div className="space-y-2">
              {Object.entries(stats.campusDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([campus, count]) => (
                  <div
                    key={campus}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {campus.toUpperCase()}
                      </Badge>
                      <span className="text-sm">
                        {count} evento{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <Progress
                      value={(count / stats.totalEvents) * 100}
                      className="h-2 w-20"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Distribución por tipo de evento */}
        {Object.keys(stats.eventTypeDistribution).length > 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Tipos de Evento
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.eventTypeDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}: {count}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Distribución por día */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Distribución Semanal
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            {Object.entries(stats.dailyDistribution).map(([day, count]) => (
              <div key={day} className="bg-muted rounded p-2 text-center">
                <div className="font-medium">{day}</div>
                <div className="text-muted-foreground">
                  {count} evento{count !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas de capacidad */}
        {stats.capacityStats.total > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Capacidad y Ocupación
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Capacidad Total:</span>
                <span className="font-medium">{stats.capacityStats.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Matriculados:</span>
                <span className="font-medium text-green-600">
                  {stats.capacityStats.enrolled}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Disponibles:</span>
                <span className="font-medium text-blue-600">
                  {stats.capacityStats.available}
                </span>
              </div>
              <Progress
                value={
                  (stats.capacityStats.enrolled / stats.capacityStats.total) *
                  100
                }
                className="h-2"
              />
            </div>
          </div>
        )}
      </div>
    )
  },
)

ScheduleStats.displayName = "ScheduleStats"
