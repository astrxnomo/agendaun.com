"use client"

import { differenceInMinutes, format, getMinutes, isPast } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"
import { useMemo } from "react"

import { getBorderRadiusClasses, getColor } from "@/components/calendar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import type { Etiquettes, Events } from "@/types"
import type { DraggableAttributes } from "@dnd-kit/core"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"

// Using date-fns format with custom formatting:
// 'h' - hours (1-12)
// 'a' - am/pm
// ':mm' - minutes with leading zero (only if the token 'mm' is present)
const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? "ha" : "h:mma", {
    locale: es,
  }).toLowerCase()
}

function EventTooltipContent({ event }: { event: Events }) {
  const displayStart = new Date(event.start)
  const displayEnd = new Date(event.end)

  const formatEventTime = () => {
    if (event.all_day) return "Todo el día"

    return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`
  }

  const formatEventDate = () => {
    return format(displayStart, "EEEE, d 'de' MMMM", { locale: es })
  }

  return (
    <div className="w-72 space-y-3 p-1">
      <div className="text-sm leading-tight font-semibold">{event.title}</div>

      <div className="space-y-2">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="capitalize">{formatEventDate()}</span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <ClockIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{formatEventTime()}</span>
        </div>

        {event.location && (
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {event.etiquette && (
          <div className="flex items-center gap-2 text-xs">
            <div
              className={cn(
                "h-3.5 w-3.5 shrink-0 rounded-full",
                getColor(event.etiquette.color),
              )}
            />
            <span className="text-muted-foreground truncate">
              {event.etiquette.name}
            </span>
          </div>
        )}
      </div>

      {event.description && (
        <div className="border-t pt-3">
          <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
            {event.description}
          </p>
        </div>
      )}
    </div>
  )
}

interface EventWrapperProps {
  event: Events
  etiquettes?: Etiquettes[]
  isFirstDay?: boolean
  isLastDay?: boolean
  isDragging?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
  children: React.ReactNode
  currentTime?: Date
  dndListeners?: SyntheticListenerMap
  dndAttributes?: DraggableAttributes
  onMouseDown?: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
}

// Shared wrapper component for event styling
function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) {
  // Calculate color using etiquettes
  const colorClass = getColor(event.etiquette?.color)

  // Always use the currentTime (if provided) to determine if the event is in the past
  const displayEnd = currentTime
    ? new Date(
        new Date(currentTime).getTime() +
          (new Date(event.end).getTime() - new Date(event.start).getTime()),
      )
    : new Date(event.end)

  const isEventInPast = isPast(displayEnd)

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "focus-visible:border-ring focus-visible:ring-ring/50 flex h-full w-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition-all duration-150 outline-none select-none hover:brightness-110 focus-visible:ring-[3px] data-dragging:cursor-grabbing data-dragging:shadow-lg data-past-event:line-through sm:px-2",
            colorClass,
            getBorderRadiusClasses(isFirstDay, isLastDay),
            className,
          )}
          data-dragging={isDragging || undefined}
          data-past-event={isEventInPast || undefined}
          onClick={onClick}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          {...dndListeners}
          {...dndAttributes}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="start"
        sideOffset={8}
        className="border-border/20 z-50"
      >
        <EventTooltipContent event={event} />
      </TooltipContent>
    </Tooltip>
  )
}

interface EventItemProps {
  event: Events
  etiquettes?: Etiquettes[]
  view: "month" | "week" | "day" | "agenda"
  isDragging?: boolean
  onClick?: (e: React.MouseEvent) => void
  showTime?: boolean
  currentTime?: Date // For updating time during drag
  isFirstDay?: boolean
  isLastDay?: boolean
  children?: React.ReactNode
  className?: string
  dndListeners?: SyntheticListenerMap
  dndAttributes?: DraggableAttributes
  onMouseDown?: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
}

export function EventItem({
  event,
  etiquettes = [],
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventItemProps) {
  const colorClass = getColor(event.etiquette?.color)

  // Use the provided currentTime (for dragging) or the event's actual time
  const displayStart = useMemo(() => {
    return currentTime || new Date(event.start)
  }, [currentTime, event.start])

  const displayEnd = useMemo(() => {
    return currentTime
      ? new Date(
          new Date(currentTime).getTime() +
            (new Date(event.end).getTime() - new Date(event.start).getTime()),
        )
      : new Date(event.end)
  }, [currentTime, event.start, event.end])

  // Calculate event duration in minutes
  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart)
  }, [displayStart, displayEnd])

  const getEventTime = () => {
    if (event.all_day) return "Todo el dia"

    // For short events (less than 45 minutes), only show start time
    if (durationMinutes < 45) {
      return formatTimeWithOptionalMinutes(displayStart)
    }

    // For longer events, show both start and end time
    return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`
  }

  if (view === "month") {
    return (
      <EventWrapper
        event={event}
        etiquettes={etiquettes}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          "mt-[var(--event-gap)] h-[var(--event-height)] items-center text-[10px] sm:text-[13px]",
          className,
        )}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {children || (
          <span className="truncate">
            {!event.all_day && (
              <span className="truncate font-normal uppercase opacity-70 sm:text-xs">
                {formatTimeWithOptionalMinutes(displayStart)}{" "}
              </span>
            )}
            {event.title}
          </span>
        )}
      </EventWrapper>
    )
  }

  if (view === "week" || view === "day") {
    return (
      <EventWrapper
        event={event}
        etiquettes={etiquettes}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          "py-1",
          durationMinutes < 45 ? "items-center" : "flex-col",
          view === "week" ? "text-[10px] sm:text-[13px]" : "text-[13px]",
          className,
        )}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {durationMinutes < 45 ? (
          <div className="truncate">
            {event.title}{" "}
            {showTime && (
              <span className="opacity-70">
                {formatTimeWithOptionalMinutes(displayStart)}
              </span>
            )}
          </div>
        ) : (
          <>
            <div className="truncate font-medium">{event.title}</div>
            {showTime && (
              <div className="truncate font-normal uppercase opacity-70 sm:text-xs">
                {getEventTime()}
              </div>
            )}
          </>
        )}
      </EventWrapper>
    )
  }

  // Agenda view - kept separate since it's significantly different
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-col gap-1 rounded p-2 text-left transition-all duration-150 outline-none focus-visible:ring-[3px] data-past-event:line-through data-past-event:opacity-90",
            colorClass,
            className,
          )}
          data-past-event={isPast(new Date(event.end)) || undefined}
          onClick={onClick}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          {...dndListeners}
          {...dndAttributes}
        >
          <div className="text-sm font-medium">{event.title}</div>
          <div className="text-xs opacity-70">
            {event.all_day ? (
              <span>Todo el dia</span>
            ) : (
              <span className="uppercase">
                {formatTimeWithOptionalMinutes(displayStart)} -{" "}
                {formatTimeWithOptionalMinutes(displayEnd)}
              </span>
            )}
            {event.location && (
              <>
                <span className="px-1 opacity-35"> · </span>
                <span>{event.location}</span>
              </>
            )}
          </div>
          {event.description && (
            <div className="my-1 text-xs opacity-90">{event.description}</div>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="start"
        sideOffset={8}
        className="border-border/20 z-50 border shadow-lg"
      >
        <EventTooltipContent event={event} />
      </TooltipContent>
    </Tooltip>
  )
}
