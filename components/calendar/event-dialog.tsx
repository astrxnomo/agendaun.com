"use client"

import { format, isBefore } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, Repeat, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import {
  DefaultEndHour,
  DefaultStartHour,
  EndHour,
  StartHour,
} from "@/components/calendar/constants"
import { isRecurringEvent } from "@/components/calendar/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import type { CalendarEvent } from "@/components/calendar/event-calendar"
import type {
  DayOfWeek,
  EventColor,
  RecurrenceType,
} from "@/components/calendar/types"

interface EventDialogProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onSave: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState(`${DefaultStartHour}:00`)
  const [endTime, setEndTime] = useState(`${DefaultEndHour}:00`)
  const [allDay, setAllDay] = useState(false)
  const [location, setLocation] = useState("")
  const [color, setColor] = useState<EventColor>("blue")
  const [error, setError] = useState<string | null>(null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  // Recurrence states
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none")
  const [recurrenceInterval, setRecurrenceInterval] = useState(1)
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>(
    undefined,
  )
  const [recurrenceCount, setRecurrenceCount] = useState<number | undefined>(
    undefined,
  )
  const [recurrenceEndType, setRecurrenceEndType] = useState<
    "never" | "date" | "count"
  >("never")
  const [recurrenceEndDateOpen, setRecurrenceEndDateOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([])

  // Days of week for the interface
  const daysOfWeek = [
    { value: 1 as DayOfWeek, label: "Lu", fullName: "Lunes" },
    { value: 2 as DayOfWeek, label: "Ma", fullName: "Martes" },
    { value: 3 as DayOfWeek, label: "Mi", fullName: "Miércoles" },
    { value: 4 as DayOfWeek, label: "Ju", fullName: "Jueves" },
    { value: 5 as DayOfWeek, label: "Vi", fullName: "Viernes" },
    { value: 6 as DayOfWeek, label: "Sa", fullName: "Sábado" },
    { value: 0 as DayOfWeek, label: "Do", fullName: "Domingo" },
  ]

  // Debug log to check what event is being passed
  useEffect(() => {
    console.log("EventDialog received event:", event)
  }, [event])

  useEffect(() => {
    if (event) {
      setTitle(event.title || "")
      setDescription(event.description || "")

      const start = new Date(event.start)
      const end = new Date(event.end)

      setStartDate(start)
      setEndDate(end)
      setStartTime(formatTimeForInput(start))
      setEndTime(formatTimeForInput(end))
      setAllDay(event.allDay || false)
      setLocation(event.location || "")
      setColor(event.color! || "sky")

      // Set recurrence values
      if (event.recurrence) {
        setRecurrenceType(event.recurrence.type)
        setRecurrenceInterval(event.recurrence.interval)
        setRecurrenceEndDate(event.recurrence.endDate)
        setRecurrenceCount(event.recurrence.count)
        setSelectedDays(event.recurrence.daysOfWeek || [])

        if (event.recurrence.endDate) {
          setRecurrenceEndType("date")
        } else if (event.recurrence.count) {
          setRecurrenceEndType("count")
        } else {
          setRecurrenceEndType("never")
        }
      } else {
        setRecurrenceType("none")
        setRecurrenceInterval(1)
        setRecurrenceEndDate(undefined)
        setRecurrenceCount(undefined)
        setRecurrenceEndType("never")
        setSelectedDays([])
      }

      setError(null) // Reset error when opening dialog
    } else {
      resetForm()
    }
  }, [event])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStartDate(new Date())
    setEndDate(new Date())
    setStartTime(`${DefaultStartHour}:00`)
    setEndTime(`${DefaultEndHour}:00`)
    setAllDay(false)
    setLocation("")
    setColor("blue")
    setRecurrenceType("none")
    setRecurrenceInterval(1)
    setRecurrenceEndDate(undefined)
    setRecurrenceCount(undefined)
    setRecurrenceEndType("never")
    setSelectedDays([])
    setError(null)
  }

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = Math.floor(date.getMinutes() / 15) * 15
    return `${hours}:${minutes.toString().padStart(2, "0")}`
  }

  // Memoize time options so they're only calculated once
  const timeOptions = useMemo(() => {
    const options = []
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        const value = `${formattedHour}:${formattedMinute}`
        // Use a fixed date to avoid unnecessary date object creations
        const date = new Date(2000, 0, 1, hour, minute)
        const label = format(date, "h:mm a", { locale: es })
        options.push({ value, label })
      }
    }
    return options
  }, []) // Empty dependency array ensures this only runs once

  const handleSave = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (!allDay) {
      const [startHours = 0, startMinutes = 0] = startTime
        .split(":")
        .map(Number)
      const [endHours = 0, endMinutes = 0] = endTime.split(":").map(Number)

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

    // Use generic title if empty
    const eventTitle = title.trim() ? title : "(no title)"

    // Build recurrence rule
    let recurrence = undefined
    if (recurrenceType !== "none") {
      recurrence = {
        type: recurrenceType,
        interval: recurrenceInterval,
        endDate: recurrenceEndType === "date" ? recurrenceEndDate : undefined,
        count: recurrenceEndType === "count" ? recurrenceCount : undefined,
        daysOfWeek:
          recurrenceType === "weekly" && selectedDays.length > 0
            ? selectedDays
            : undefined,
      }
    }

    onSave({
      id: event?.id || "",
      title: eventTitle,
      description,
      start,
      end,
      allDay,
      location,
      color,
      recurrence,
    })
  }

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id)
    }
  }

  const toggleDaySelection = (day: DayOfWeek) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day)
      } else {
        return [...prev, day].sort()
      }
    })
  }

  // Updated color options to match types.ts
  const colorOptions: Array<{
    value: EventColor
    label: string
    bgClass: string
    borderClass: string
  }> = [
    {
      value: "blue",
      label: "Blue",
      bgClass: "bg-blue-400 data-[state=checked]:bg-blue-400",
      borderClass: "border-blue-400 data-[state=checked]:border-blue-400",
    },
    {
      value: "violet",
      label: "Violet",
      bgClass: "bg-violet-400 data-[state=checked]:bg-violet-400",
      borderClass: "border-violet-400 data-[state=checked]:border-violet-400",
    },
    {
      value: "rose",
      label: "Rose",
      bgClass: "bg-rose-400 data-[state=checked]:bg-rose-400",
      borderClass: "border-rose-400 data-[state=checked]:border-rose-400",
    },
    {
      value: "emerald",
      label: "Emerald",
      bgClass: "bg-emerald-400 data-[state=checked]:bg-emerald-400",
      borderClass: "border-emerald-400 data-[state=checked]:border-emerald-400",
    },
    {
      value: "orange",
      label: "Orange",
      bgClass: "bg-orange-400 data-[state=checked]:bg-orange-400",
      borderClass: "border-orange-400 data-[state=checked]:border-orange-400",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {event?.id ? "Edit Event" : "Create Event"}
            {event && isRecurringEvent(event) && (
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                <Repeat className="h-4 w-4" />
                <span>Serie recurrente</span>
              </div>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {event?.id
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
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="start-date">Start Date</Label>
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
                    <CalendarDays
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
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="start-time">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="end-date">End Date</Label>
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
                    <CalendarDays
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
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="end-time">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="all-day"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked === true)}
            />
            <Label htmlFor="all-day">All day</Label>
          </div>

          {/* Recurrence Section */}
          <fieldset className="space-y-3">
            <legend className="text-foreground text-sm leading-none font-medium">
              Repetir
            </legend>

            <div className="*:not-first:mt-1.5">
              <Label htmlFor="recurrence-type">Tipo de repetición</Label>
              <Select
                value={recurrenceType}
                onValueChange={(value: RecurrenceType) =>
                  setRecurrenceType(value)
                }
              >
                <SelectTrigger id="recurrence-type">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No repetir</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensualmente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recurrenceType !== "none" && (
              <>
                <div className="*:not-first:mt-1.5">
                  <Label htmlFor="recurrence-interval">
                    Repetir cada {recurrenceInterval}{" "}
                    {recurrenceType === "daily"
                      ? recurrenceInterval === 1
                        ? "día"
                        : "días"
                      : recurrenceType === "weekly"
                        ? recurrenceInterval === 1
                          ? "semana"
                          : "semanas"
                        : recurrenceInterval === 1
                          ? "mes"
                          : "meses"}
                  </Label>
                  <Select
                    value={recurrenceInterval.toString()}
                    onValueChange={(value) =>
                      setRecurrenceInterval(parseInt(value))
                    }
                  >
                    <SelectTrigger id="recurrence-interval">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Days of week selector for weekly recurrence */}
                {recurrenceType === "weekly" && (
                  <div className="space-y-2">
                    <Label>Días de la semana</Label>
                    <div className="flex gap-1">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDaySelection(day.value)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                            selectedDays.includes(day.value)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80",
                          )}
                          title={day.fullName}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label>Finaliza</Label>
                  <RadioGroup
                    value={recurrenceEndType}
                    onValueChange={(value: "never" | "date" | "count") =>
                      setRecurrenceEndType(value)
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="end-never" />
                      <Label htmlFor="end-never" className="text-sm">
                        Nunca
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="date" id="end-date-radio" />
                      <Label htmlFor="end-date-radio" className="text-sm">
                        El
                      </Label>
                      {recurrenceEndType === "date" && (
                        <Popover
                          open={recurrenceEndDateOpen}
                          onOpenChange={setRecurrenceEndDateOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "h-8 justify-start text-left font-normal",
                                !recurrenceEndDate && "text-muted-foreground",
                              )}
                            >
                              {recurrenceEndDate
                                ? format(recurrenceEndDate, "d 'de' MMM", {
                                    locale: es,
                                  })
                                : "Fecha"}
                              <CalendarDays className="ml-2 h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" align="start">
                            <Calendar
                              mode="single"
                              selected={recurrenceEndDate}
                              onSelect={(date) => {
                                if (date) {
                                  setRecurrenceEndDate(date)
                                  setRecurrenceEndDateOpen(false)
                                }
                              }}
                              disabled={{ before: startDate }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="count" id="end-count" />
                      <Label htmlFor="end-count" className="text-sm">
                        Después de
                      </Label>
                      {recurrenceEndType === "count" && (
                        <>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={recurrenceCount || ""}
                            onChange={(e) =>
                              setRecurrenceCount(
                                parseInt(e.target.value) || undefined,
                              )
                            }
                            className="h-8 w-16 text-center"
                          />
                          <span className="text-muted-foreground text-sm">
                            veces
                          </span>
                        </>
                      )}
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </fieldset>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <fieldset className="space-y-4">
            <legend className="text-foreground text-sm leading-none font-medium">
              Etiquette
            </legend>
            <RadioGroup
              className="flex gap-1.5"
              defaultValue={colorOptions[0]?.value}
              value={color}
              onValueChange={(value: EventColor) => setColor(value)}
            >
              {colorOptions.map((colorOption) => (
                <RadioGroupItem
                  key={colorOption.value}
                  id={`color-${colorOption.value}`}
                  value={colorOption.value}
                  aria-label={colorOption.label}
                  className={cn(
                    "size-6 shadow-none",
                    colorOption.bgClass,
                    colorOption.borderClass,
                  )}
                />
              ))}
            </RadioGroup>
          </fieldset>
        </div>

        {event && isRecurringEvent(event) && (
          <div className="border-muted bg-muted/20 rounded-md border p-3">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Repeat className="h-4 w-4" />
              <span>
                <strong>Evento recurrente:</strong> Los cambios afectarán a toda
                la serie de eventos.
              </span>
            </div>
          </div>
        )}

        <DialogFooter className="flex-row sm:justify-between">
          {event?.id && (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              size="icon"
              onClick={handleDelete}
              aria-label="Delete event"
            >
              <Trash2 size={16} aria-hidden="true" />
            </Button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
