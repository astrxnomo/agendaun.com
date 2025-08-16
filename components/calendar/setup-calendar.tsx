"use client"

import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarCog,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Plus,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  addHoursToDate,
  AgendaDaysToShow,
  AgendaView,
  CalendarDndProvider,
  DayView,
  EventDialog,
  EventGap,
  EventHeight,
  EventViewDialog,
  MonthView,
  useCalendarContext,
  WeekCellsHeight,
  WeekView,
  type CalendarPermissions,
} from "@/components/calendar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { DefaultView, type Etiquettes, type Events } from "@/types/db"

export interface EventCalendarProps {
  events?: Events[]
  onEventAdd?: (event: Events) => void
  onEventUpdate?: (event: Events) => void
  onEventDelete?: (eventId: string) => void
  className?: string
  initialView?: DefaultView
  editable?: boolean
  permissions?: CalendarPermissions
  customEtiquettes?: Etiquettes[] // ← Usa tu modelo de Etiquettes
}

export function SetupCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = DefaultView.MONTH,
  editable = true,
  permissions,
  customEtiquettes: etiquettes = [], // ← Recibir etiquetas con default vacío
}: EventCalendarProps) {
  // Use the shared calendar context instead of local state
  const { currentDate, setCurrentDate } = useCalendarContext()
  const [view, setView] = useState<DefaultView>(initialView)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isEventViewDialogOpen, setIsEventViewDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null)

  // Add keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element
      // or if the event dialog is open
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView(DefaultView.MONTH)
          break
        case "s":
          setView(DefaultView.WEEK)
          break
        case "d":
          setView(DefaultView.DAY)
          break
        case "a":
          setView(DefaultView.AGENDA)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isEventDialogOpen])

  const handlePrevious = () => {
    if (view === DefaultView.MONTH) {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (view === DefaultView.WEEK) {
      setCurrentDate(subWeeks(currentDate, 1))
    } else if (view === DefaultView.DAY) {
      setCurrentDate(addDays(currentDate, -1))
    } else if (view === DefaultView.AGENDA) {
      // For agenda view, go back 30 days (a full month)
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow))
    }
  }

  const handleNext = () => {
    if (view === DefaultView.MONTH) {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === DefaultView.WEEK) {
      setCurrentDate(addWeeks(currentDate, 1))
    } else if (view === DefaultView.DAY) {
      setCurrentDate(addDays(currentDate, 1))
    } else if (view === DefaultView.AGENDA) {
      // For agenda view, go forward 30 days (a full month)
      setCurrentDate(addDays(currentDate, AgendaDaysToShow))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleEventSelect = (event: Events) => {
    setSelectedEvent(event)
    if (permissions?.canEdit && editable) {
      setIsEventDialogOpen(true)
    } else {
      setIsEventViewDialogOpen(true)
    }
  }

  const handleEventCreate = (startTime: Date) => {
    if (!editable || !permissions?.canCreate) return // No permitir creación si no es editable o no tiene permisos

    // Snap to 15-minute intervals
    const minutes = startTime.getMinutes()
    const remainder = minutes % 15
    if (remainder !== 0) {
      if (remainder < 7.5) {
        // Round down to nearest 15 min
        startTime.setMinutes(minutes - remainder)
      } else {
        // Round up to nearest 15 min
        startTime.setMinutes(minutes + (15 - remainder))
      }
      startTime.setSeconds(0)
      startTime.setMilliseconds(0)
    }

    const newEvent: Events = {
      title: "",
      start: startTime,
      end: addHoursToDate(startTime, 1),
      allDay: false,
    }
    setSelectedEvent(newEvent)
    setIsEventDialogOpen(true)
  }

  const handleEventSave = (event: Events) => {
    if (event.id) {
      onEventUpdate?.(event)
      toast(`Evento "${event.title}" actualizado`, {
        /* ... */
      })
    } else {
      onEventAdd?.({
        ...event,
        id: Math.random().toString(36).substring(2, 11),
      })
      toast(`Evento "${event.title}" agregado`, {
        /* ... */
      })
    }
    setIsEventDialogOpen(false)
    setSelectedEvent(null)
  }

  const handleEventDelete = (eventId: string) => {
    const deletedEvent = events.find((e) => e.id === eventId)
    onEventDelete?.(eventId)
    setIsEventDialogOpen(false)
    setSelectedEvent(null)

    // Show toast notification when an event is deleted
    if (deletedEvent) {
      toast(`Evento "${deletedEvent.title}" eliminado`, {
        description: format(new Date(deletedEvent.start), "MMM d, yyyy", {
          locale: es,
        }),
      })
    }
  }

  const handleEventUpdate = (updatedEvent: Events) => {
    onEventUpdate?.(updatedEvent)
    toast(`Evento "${updatedEvent.title}" movido`, {
      /* ... */
    })
  }

  const viewTitle = useMemo(() => {
    if (view === DefaultView.MONTH) {
      return format(currentDate, "MMMM yyyy", { locale: es })
    } else if (view === DefaultView.WEEK) {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      const end = endOfWeek(currentDate, { weekStartsOn: 1 })
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: es })
      } else {
        return `${format(start, "MMM", { locale: es })} - ${format(end, "MMM yyyy", { locale: es })}`
      }
    } else if (view === DefaultView.DAY) {
      return (
        <>
          <span className="min-sm:hidden" aria-hidden="true">
            {format(currentDate, "MMM d, yyyy", { locale: es })}
          </span>
          <span className="max-sm:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, "MMMM d, yyyy", { locale: es })}
          </span>
          <span className="capitalize max-md:hidden">
            {format(currentDate, "EEE MMMM d, yyyy", { locale: es })}
          </span>
        </>
      )
    } else if (view === DefaultView.AGENDA) {
      // Show the month range for agenda view
      const start = currentDate
      const end = addDays(currentDate, AgendaDaysToShow - 1)

      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: es })
      } else {
        return `${format(start, "MMM", { locale: es })} - ${format(end, "MMM yyyy", { locale: es })}`
      }
    } else {
      return format(currentDate, "MMMM yyyy", { locale: es })
    }
  }, [currentDate, view])

  return (
    <div
      className="flex flex-col has-data-[slot=month-view]:flex-1"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdate={handleEventUpdate}>
        <div
          className={cn(
            "flex flex-col justify-between gap-2 px-4 py-5 sm:flex-row sm:items-center",
            className,
          )}
        >
          <div className="flex justify-between gap-1.5 max-sm:items-center sm:flex-col">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-semibold capitalize transition-transform duration-300 ease-in-out lg:peer-data-[state=invisible]:-translate-x-7.5">
                {viewTitle}
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center max-sm:order-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="max-sm:size-8"
                  onClick={handlePrevious}
                  aria-label="Previous"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="max-sm:size-8"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </div>
              <Button
                className="max-sm:h-8 max-sm:px-2.5!"
                onClick={handleToday}
              >
                Hoy
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2">
              {editable && permissions?.canCreate && (
                <Button
                  className="max-sm:h-8 max-sm:px-2.5!"
                  onClick={() => {
                    setSelectedEvent(null)
                    setIsEventDialogOpen(true)
                  }}
                >
                  <Plus />
                  Nuevo Evento
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-1.5 max-sm:h-8 max-sm:gap-1 max-sm:px-2!"
                  >
                    <CalendarCog />
                    {view === DefaultView.MONTH
                      ? "Mes"
                      : view === DefaultView.WEEK
                        ? "Semana"
                        : view === DefaultView.DAY
                          ? "Día"
                          : DefaultView.AGENDA}
                    <ChevronDownIcon
                      className="-me-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-32">
                  <DropdownMenuItem onClick={() => setView(DefaultView.MONTH)}>
                    Mes <DropdownMenuShortcut>M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView(DefaultView.WEEK)}>
                    Semana <DropdownMenuShortcut>S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView(DefaultView.DAY)}>
                    Día <DropdownMenuShortcut>D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView(DefaultView.AGENDA)}>
                    Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {view === DefaultView.MONTH && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
              editable={editable}
              permissions={permissions}
            />
          )}
          {view === DefaultView.WEEK && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
              editable={editable}
              permissions={permissions}
            />
          )}
          {view === DefaultView.DAY && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
              editable={editable}
              permissions={permissions}
            />
          )}
          {view === DefaultView.AGENDA && (
            <AgendaView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
            />
          )}
        </div>

        <EventDialog
          event={selectedEvent}
          isOpen={isEventDialogOpen}
          onClose={() => {
            setIsEventDialogOpen(false)
            setSelectedEvent(null)
          }}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
          customEtiquettes={etiquettes}
        />

        <EventViewDialog
          event={selectedEvent}
          isOpen={isEventViewDialogOpen}
          onClose={() => {
            setIsEventViewDialogOpen(false)
            setSelectedEvent(null)
          }}
          etiquettes={etiquettes}
        />
      </CalendarDndProvider>
    </div>
  )
}
