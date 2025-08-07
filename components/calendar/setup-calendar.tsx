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

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import { AgendaView } from "./agenda-view"
import { useCalendarContext } from "./calendar-context"
import { CalendarDndProvider } from "./calendar-dnd-context"
import {
  AgendaDaysToShow,
  EventGap,
  EventHeight,
  WeekCellsHeight,
} from "./constants"
import { DayView } from "./day-view"
import { EventDialog } from "./event-dialog"
import { EventViewDialog } from "./event-view-dialog"
import { MonthView } from "./month-view"
import { type CalendarPermissions } from "./permissions"
import { type CalendarEvent, type CalendarView, type Etiquette } from "./types"
import { addHoursToDate } from "./utils"
import { WeekView } from "./week-view"

export interface EventCalendarProps {
  events?: CalendarEvent[]
  onEventAdd?: (event: CalendarEvent) => void
  onEventUpdate?: (event: CalendarEvent) => void
  onEventDelete?: (eventId: string) => void
  className?: string
  initialView?: CalendarView
  editable?: boolean
  permissions?: CalendarPermissions
  customEtiquettes?: Etiquette[] // ← Nueva prop para las etiquetas disponibles
}

export function SetupCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = "month",
  editable = true,
  permissions,
  customEtiquettes: etiquettes = [], // ← Recibir etiquetas con default vacío
}: EventCalendarProps) {
  // Use the shared calendar context instead of local state
  const { currentDate, setCurrentDate } = useCalendarContext()
  const [view, setView] = useState<CalendarView>(initialView)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isEventViewDialogOpen, setIsEventViewDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

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
          setView("month")
          break
        case "w":
          setView("week")
          break
        case "d":
          setView("day")
          break
        case "a":
          setView("agenda")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isEventDialogOpen])

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1))
    } else if (view === "agenda") {
      // For agenda view, go back 30 days (a full month)
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow))
    }
  }

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1))
    } else if (view === "agenda") {
      // For agenda view, go forward 30 days (a full month)
      setCurrentDate(addDays(currentDate, AgendaDaysToShow))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event)

    // Si el usuario tiene permisos de edición, abrir dialog de edición
    // Si no, abrir dialog de solo lectura
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

    const newEvent: CalendarEvent = {
      id: "",
      title: "",
      start: startTime,
      end: addHoursToDate(startTime, 1),
      allDay: false,
    }
    setSelectedEvent(newEvent)
    setIsEventDialogOpen(true)
  }

  const handleEventSave = (event: CalendarEvent) => {
    if (event.id) {
      onEventUpdate?.(event)
      // Show toast notification when an event is updated
      toast(`Evento "${event.title}" actualizado`, {
        description: format(new Date(event.start), "MMM d, yyyy", {
          locale: es,
        }),
      })
    } else {
      onEventAdd?.({
        ...event,
        id: Math.random().toString(36).substring(2, 11),
      })
      // Show toast notification when an event is added
      toast(`Evento "${event.title}" agregado`, {
        description: format(new Date(event.start), "MMM d, yyyy", {
          locale: es,
        }),
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

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(updatedEvent)

    // Show toast notification when an event is updated via drag and drop
    toast(`Evento "${updatedEvent.title}" movido`, {
      description: format(new Date(updatedEvent.start), "MMM d, yyyy", {
        locale: es,
      }),
    })
  }

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale: es })
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      const end = endOfWeek(currentDate, { weekStartsOn: 1 })
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: es })
      } else {
        return `${format(start, "MMM", { locale: es })} - ${format(end, "MMM yyyy", { locale: es })}`
      }
    } else if (view === "day") {
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
    } else if (view === "agenda") {
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
                    {view === "month"
                      ? "Mes"
                      : view === "week"
                        ? "Semana"
                        : view === "day"
                          ? "Día"
                          : "Agenda"}
                    <ChevronDownIcon
                      className="-me-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-32">
                  <DropdownMenuItem onClick={() => setView("month")}>
                    Mes <DropdownMenuShortcut>M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView("week")}>
                    Semana <DropdownMenuShortcut>S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView("day")}>
                    Día <DropdownMenuShortcut>D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView("agenda")}>
                    Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "agenda" && (
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
          customEtiquettes={etiquettes} // ← Pasar etiquetas al diálogo
        />

        <EventViewDialog
          event={selectedEvent}
          isOpen={isEventViewDialogOpen}
          onClose={() => {
            setIsEventViewDialogOpen(false)
            setSelectedEvent(null)
          }}
          etiquettes={etiquettes} // ← Pasar etiquetas al diálogo de vista
        />
      </CalendarDndProvider>
    </div>
  )
}
