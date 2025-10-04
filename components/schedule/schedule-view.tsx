"use client"

import {
  addHours,
  differenceInMinutes,
  eachHourOfInterval,
  format,
  getHours,
  getMinutes,
  startOfDay,
} from "date-fns"
import { es } from "date-fns/locale"
import React, { useMemo } from "react"

import { cn } from "@/lib/utils"

import {
  DaysOfWeek,
  EndHour,
  MinEventHeight,
  QuarterHourIntervals,
  StartHour,
  WeekCellsHeight,
} from "./constants"

import type { ScheduleEvents } from "@/types"

interface ScheduleViewProps {
  events: ScheduleEvents[]
  onEventSelect?: (event: ScheduleEvents) => void
  onEventCreate?: (startTime: Date) => void
  editable?: boolean
  canEdit?: boolean
}

interface PositionedEvent {
  event: ScheduleEvents
  top: number
  height: number
  left: number
  width: number
  zIndex: number
}

export function ScheduleView({
  events,
  onEventSelect,
  onEventCreate,
  editable = false,
  canEdit = false,
}: ScheduleViewProps) {
  const hours = useMemo(() => {
    const today = new Date()
    const dayStart = startOfDay(today)
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    })
  }, [])

  // Process events for each day (0 = Monday, 6 = Sunday)
  const processedDayEvents = useMemo(() => {
    const result = Array.from({ length: 7 }, (_, dayIndex) => {
      // Filter events for this day of the week
      const dayEvents = events.filter((event) => {
        const eventStart = new Date(event.start_time)
        const eventDayOfWeek = (eventStart.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
        return eventDayOfWeek === dayIndex
      })

      // Sort events by start time and duration
      const sortedEvents = [...dayEvents].sort((a, b) => {
        const aStart = new Date(a.start_time)
        const bStart = new Date(b.start_time)
        const aEnd = new Date(a.end_time)
        const bEnd = new Date(b.end_time)

        // First sort by start time
        if (aStart < bStart) return -1
        if (aStart > bStart) return 1

        // If start times are equal, sort by duration (longer events first)
        const aDuration = differenceInMinutes(aEnd, aStart)
        const bDuration = differenceInMinutes(bEnd, bStart)
        return bDuration - aDuration
      })

      // Calculate positions for each event
      const positionedEvents: PositionedEvent[] = []

      // Track columns for overlapping events
      const columns: { event: ScheduleEvents; endHour: number }[][] = []

      sortedEvents.forEach((event) => {
        const eventStart = new Date(event.start_time)
        const eventEnd = new Date(event.end_time)

        // Calculate top position and height
        const startHour = getHours(eventStart) + getMinutes(eventStart) / 60
        const endHour = getHours(eventEnd) + getMinutes(eventEnd) / 60

        // Skip events outside our time range
        if (endHour <= StartHour || startHour >= EndHour) return

        // Clamp to our time range
        const clampedStartHour = Math.max(startHour, StartHour)
        const clampedEndHour = Math.min(endHour, EndHour)

        const top = (clampedStartHour - StartHour) * WeekCellsHeight
        const height = (clampedEndHour - clampedStartHour) * WeekCellsHeight

        // Find a column for this event
        let columnIndex = 0
        let placed = false

        while (!placed) {
          const col = columns[columnIndex] || []
          if (col.length === 0) {
            columns[columnIndex] = col
            placed = true
          } else {
            const overlaps = col.some((c) => {
              // Check if events overlap
              const cStartHour =
                getHours(new Date(c.event.start_time)) +
                getMinutes(new Date(c.event.start_time)) / 60
              return clampedStartHour < c.endHour && clampedEndHour > cStartHour
            })
            if (!overlaps) {
              placed = true
            } else {
              columnIndex++
            }
          }
        }

        // Ensure column is initialized before pushing
        const currentColumn = columns[columnIndex] || []
        columns[columnIndex] = currentColumn
        currentColumn.push({ event, endHour: clampedEndHour })

        // Calculate width and left position based on number of columns
        const totalColumns = Math.max(columns.length, 1)
        const width = 1 / totalColumns
        const left = columnIndex / totalColumns

        positionedEvents.push({
          event,
          top,
          height,
          left,
          width,
          zIndex: 10 + columnIndex,
        })
      })

      return positionedEvents
    })

    return result
  }, [events])

  const handleEventClick = React.useCallback(
    (event: ScheduleEvents, e: React.MouseEvent) => {
      e.stopPropagation()
      onEventSelect?.(event)
    },
    [onEventSelect],
  )

  return (
    <div
      data-slot="schedule-view"
      className="flex h-full flex-col overflow-y-auto"
    >
      {/* Header with days of the week */}
      <div className="bg-background border-border/70 sticky top-0 z-20 grid grid-cols-8 border-y uppercase">
        <div className="text-muted-foreground/70 py-2 text-center text-xs">
          Hora
        </div>
        {DaysOfWeek.map((day) => (
          <div
            key={day}
            className="text-muted-foreground/70 py-2 text-center text-xs"
          >
            <span className="sm:hidden" aria-hidden="true">
              {day[0]}
            </span>
            <span className="max-sm:hidden">{day}</span>
          </div>
        ))}
      </div>

      {/* Schedule grid */}
      <div className="grid grid-cols-8">
        {/* Hours column */}
        <div className="border-border/70 grid auto-cols-fr border-r">
          {hours.map((hour, index) => (
            <div
              key={hour.toString()}
              className="border-border/70 relative min-h-[var(--week-cells-height)] border-b last:border-b-0"
            >
              {index > 0 && (
                <span className="bg-background text-muted-foreground/70 absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end pe-2 text-[10px] sm:pe-4 sm:text-xs">
                  {format(hour, "h a", { locale: es })}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Days columns */}
        {DaysOfWeek.map((_, dayIndex) => (
          <div
            key={dayIndex}
            className="border-border/70 relative grid auto-cols-fr border-r last:border-r-0"
          >
            {/* Positioned events */}
            {(processedDayEvents[dayIndex] ?? []).map((positionedEvent) => (
              <div
                key={positionedEvent.event.$id}
                className="absolute z-10 px-0.5"
                style={{
                  top: `${positionedEvent.top}px`,
                  height: `${positionedEvent.height}px`,
                  left: `${positionedEvent.left * 100}%`,
                  width: `${positionedEvent.width * 100}%`,
                  zIndex: positionedEvent.zIndex,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full w-full">
                  <ScheduleEvents
                    event={positionedEvent.event}
                    onClick={(e) => handleEventClick(positionedEvent.event, e)}
                    height={positionedEvent.height}
                  />
                </div>
              </div>
            ))}

            {/* Hour cells with click to create functionality */}
            {hours.map((hour) => {
              const hourValue = getHours(hour)
              return (
                <div
                  key={hour.toString()}
                  className="border-border/70 relative min-h-[var(--week-cells-height)] border-b last:border-b-0"
                >
                  {/* Quarter-hour intervals for creating events */}
                  {editable &&
                    canEdit &&
                    QuarterHourIntervals.map((quarter) => {
                      const dayOfWeek = dayIndex // 0 = Monday, 6 = Sunday

                      return (
                        <div
                          key={`${hour.toString()}-${quarter}`}
                          className={cn(
                            "hover:bg-foreground/10 absolute h-[calc(var(--week-cells-height)/4)] w-full cursor-pointer transition-colors",
                            quarter === 0 && "top-0",
                            quarter === 1 &&
                              "top-[calc(var(--week-cells-height)/4)]",
                            quarter === 2 &&
                              "top-[calc(var(--week-cells-height)/4*2)]",
                            quarter === 3 &&
                              "top-[calc(var(--week-cells-height)/4*3)]",
                          )}
                          title="Crear evento"
                          onClick={() => {
                            if (onEventCreate) {
                              // Create a date for this day of week and time
                              const today = new Date()
                              const currentDayOfWeek = (today.getDay() + 6) % 7 // Convert to Monday=0
                              const daysToAdd = dayOfWeek - currentDayOfWeek
                              const startTime = new Date(today)
                              startTime.setDate(today.getDate() + daysToAdd)
                              startTime.setHours(hourValue)
                              startTime.setMinutes(quarter * 15)
                              startTime.setSeconds(0)
                              startTime.setMilliseconds(0)
                              onEventCreate(startTime)
                            }
                          }}
                        />
                      )
                    })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple event component for schedule view
interface ScheduleEventsProps {
  event: ScheduleEvents
  onClick: (e: React.MouseEvent) => void
  height: number
}

const ScheduleEvents = React.memo(function ScheduleEvents({
  event,
  onClick,
  height,
}: ScheduleEventsProps) {
  const startTime = new Date(event.start_time)
  const endTime = new Date(event.end_time)
  const showTime = height >= MinEventHeight

  return (
    <div
      className={cn(
        "flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-md bg-green-200 px-2 py-1 text-green-900/90 shadow-green-700/8 transition-all hover:bg-green-200/40",
        "dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-900/90",
      )}
      onClick={onClick}
    >
      <div className="flex-1 overflow-hidden">
        <div className="truncate text-xs font-medium">{event.title}</div>
        {showTime && (
          <div className="text-xs opacity-75">
            {format(startTime, "h:mm a", { locale: es })}
            {" - "}
            {format(endTime, "h:mm a", { locale: es })}
          </div>
        )}
      </div>
    </div>
  )
})
