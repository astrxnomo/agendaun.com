"use client"

import { Time } from "@internationalized/date"
import { format, isBefore } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ClockIcon, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Label as AriaLabel } from "react-aria-components"

import {
  DefaultEndHour,
  DefaultStartHour,
  EndHour,
  StartHour,
} from "@/components/calendar/constants"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { DateInput, TimeField } from "@/components/ui/datefield-rac"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useAuthContext } from "@/contexts/auth-context"
import { cn, getColorIndicator } from "@/lib/utils"

import type {
  CalendarEtiquettes,
  CalendarEvents,
  Calendars,
} from "@/lib/data/types"

interface EventDialogProps {
  calendar: Calendars
  event: CalendarEvents | Partial<CalendarEvents> | null
  etiquettes?: CalendarEtiquettes[]
  isOpen: boolean
  onClose: () => void
  onSave: (event: CalendarEvents) => void
  onDelete: (eventId: string) => void
}

export function EventDialog({
  calendar,
  event,
  etiquettes = [],
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const { profile } = useAuthContext()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState<Time>(
    new Time(DefaultStartHour, 0),
  )
  const [endTime, setEndTime] = useState<Time>(new Time(DefaultEndHour, 0))
  const [allDay, setAllDay] = useState(false)
  const [location, setLocation] = useState("")
  const [etiquette, setEtiquette] = useState<CalendarEtiquettes | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  useEffect(() => {
    if (event) {
      setTitle(event.title || "")
      setDescription(event.description || "")

      const start = event.start ? new Date(event.start) : new Date()
      const end = event.end ? new Date(event.end) : new Date()
      const matchingEtiquette = etiquettes.find(
        (etiq) => etiq.$id === event.etiquette?.$id,
      )

      setStartDate(start)
      setEndDate(end)
      setStartTime(new Time(start.getHours(), start.getMinutes()))
      setEndTime(new Time(end.getHours(), end.getMinutes()))
      setAllDay(event.all_day || false)
      setLocation(event.location || "")
      setEtiquette(matchingEtiquette || null)
      setError(null)
    } else {
      resetForm()
    }
  }, [event, etiquettes])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStartDate(new Date())
    setEndDate(new Date())
    setStartTime(new Time(DefaultStartHour, 0))
    setEndTime(new Time(DefaultEndHour, 0))
    setAllDay(false)
    setLocation("")
    setEtiquette(null)
    setError(null)
  }

  const handleSave = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (!allDay) {
      const startHours = startTime.hour
      const startMinutes = startTime.minute
      const endHours = endTime.hour
      const endMinutes = endTime.minute

      if (
        startHours < StartHour ||
        startHours > EndHour ||
        endHours < StartHour ||
        endHours > EndHour
      ) {
        setError(
          `Selected time must be between ${StartHour}:00 and ${EndHour}:00`,
        )
        return
      }

      start.setHours(startHours, startMinutes, 0)
      end.setHours(endHours, endMinutes, 0)
    } else {
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
    }

    // Validate that end date is not before start date
    if (isBefore(end, start)) {
      setError("End date cannot be before start date")
      return
    }

    const eventTitle = title.trim() ? title : "(sin título)"

    const eventData = {
      ...event,
      title: eventTitle,
      description,
      start: start.toISOString(),
      end: end.toISOString(),
      all_day: allDay,
      location,
      etiquette: etiquette?.$id ? { $id: etiquette.$id } : undefined,
      sede:
        calendar.slug === "sede" && profile?.sede?.$id
          ? { $id: profile.sede.$id }
          : undefined,
      faculty:
        calendar.slug === "faculty" && profile?.faculty?.$id
          ? { $id: profile.faculty.$id }
          : undefined,
      program:
        calendar.slug === "program" && profile?.program?.$id
          ? { $id: profile.program.$id }
          : undefined,
      calendar: calendar,
    }

    onSave(eventData as any)
  }

  const handleDelete = () => {
    if (event?.$id) {
      onDelete(event.$id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event?.$id ? "Editar" : "Crear"}</DialogTitle>
          <DialogDescription className="sr-only">
            {event?.$id
              ? "Edit the details of this event"
              : "Add a new event to your calendar"}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <div className="grid gap-4 py-4">
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="start-date">Fecha de inicio</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant={"outline"}
                    className={cn(
                      "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "truncate",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      {startDate
                        ? format(startDate, "PPP", { locale: es })
                        : "Seleccionar fecha"}
                    </span>
                    <CalendarIcon
                      size={16}
                      className="text-muted-foreground/80 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    defaultMonth={startDate}
                    weekStartsOn={1}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date)
                        // If end date is before the new start date, update it to match the start date
                        if (isBefore(endDate, date)) {
                          setEndDate(date)
                        }
                        setError(null)
                        setStartDateOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {!allDay && (
              <div className="w-36 space-y-2">
                <TimeField
                  value={startTime}
                  onChange={(value) => {
                    if (value) setStartTime(value)
                  }}
                  hourCycle={12}
                >
                  <AriaLabel className="text-sm font-medium">
                    Hora de Inicio
                  </AriaLabel>
                  <div className="relative">
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3">
                      <ClockIcon size={16} aria-hidden="true" />
                    </div>
                    <DateInput className="ps-9" />
                  </div>
                </TimeField>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="end-date">Fecha de Fin</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant={"outline"}
                    className={cn(
                      "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "truncate",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      {endDate
                        ? format(endDate, "PPP", { locale: es })
                        : "Seleccionar fecha"}
                    </span>
                    <CalendarIcon
                      size={16}
                      className="text-muted-foreground/80 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    defaultMonth={endDate}
                    weekStartsOn={1}
                    disabled={{ before: startDate }}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date)
                        setError(null)
                        setEndDateOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!allDay && (
              <div className="w-36 space-y-2">
                <TimeField
                  value={endTime}
                  onChange={(value) => {
                    if (value) setEndTime(value)
                  }}
                  hourCycle={12}
                >
                  <AriaLabel className="text-sm font-medium">
                    Hora de Fin
                  </AriaLabel>
                  <div className="relative">
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3">
                      <ClockIcon size={16} aria-hidden="true" />
                    </div>
                    <DateInput className="ps-9" />
                  </div>
                </TimeField>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="all-day"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked === true)}
            />
            <Label htmlFor="all-day">Todo el día</Label>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <fieldset className="space-y-4">
            <legend className="text-foreground text-sm leading-none font-medium">
              Etiqueta
            </legend>
            <RadioGroup
              className="grid grid-cols-2 gap-2"
              value={etiquette?.$id || "none"}
              onValueChange={(value) =>
                setEtiquette(
                  value === "none"
                    ? null
                    : etiquettes.find((etiq) => etiq.$id === value) || null,
                )
              }
            >
              {/* Etiquetas disponibles */}
              {etiquettes.map((etiq) => (
                <label
                  key={etiq.$id}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                    etiquette?.$id === etiq.$id
                      ? "border-primary bg-primary/5"
                      : "border-input hover:bg-muted",
                  )}
                >
                  <RadioGroupItem value={etiq.$id} className="sr-only" />
                  <div
                    className={cn(
                      "size-3 rounded-full border border-gray-400",
                      getColorIndicator(etiq.color),
                    )}
                  />
                  <span>{etiq.name}</span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>
        </div>
        <DialogFooter className="flex-row sm:justify-between">
          {event?.$id && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash />
            </Button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
