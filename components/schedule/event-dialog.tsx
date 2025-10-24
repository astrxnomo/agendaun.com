"use client"

import { Time } from "@internationalized/date"
import { ClockIcon, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Label as AriaLabel } from "react-aria-components"

import { getColorIndicator } from "@/components/calendar"
import { Button } from "@/components/ui/button"
import { DateInput, TimeField } from "@/components/ui/datefield-rac"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Colors } from "@/lib/appwrite/types"

import type { ScheduleEvents, Schedules } from "@/lib/appwrite/types"

interface ScheduleEventDialogProps {
  schedule: Schedules
  event: ScheduleEvents | Partial<ScheduleEvents> | null
  isOpen: boolean
  onClose: () => void
  onSave: (event: ScheduleEvents) => void
  onDelete?: (eventId: string) => void
}

export function ScheduleEventDialog({
  schedule,
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: ScheduleEventDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dayOfWeek, setDayOfWeek] = useState(1) // 1 = Monday, 7 = Sunday
  const [startTime, setStartTime] = useState<Time>(new Time(9, 0))
  const [endTime, setEndTime] = useState<Time>(new Time(10, 0))
  const [location, setLocation] = useState("")
  const [color, setColor] = useState<Colors>(Colors.GREEN)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (event) {
      setTitle(event.title || "")
      setDescription(event.description || "")
      setLocation(event.location || "")
      setColor(event.color || Colors.GREEN)

      if (event.start_time) {
        const startDateTime = new Date(event.start_time)
        // Convert JavaScript day (0 = Sunday) to Monday-first (1 = Monday)
        const jsDay = startDateTime.getDay()
        const mondayFirstDay = jsDay === 0 ? 7 : jsDay
        setDayOfWeek(mondayFirstDay)
        setStartTime(
          new Time(startDateTime.getHours(), startDateTime.getMinutes()),
        )
      }

      if (event.end_time) {
        const endDateTime = new Date(event.end_time)
        setEndTime(new Time(endDateTime.getHours(), endDateTime.getMinutes()))
      }
    } else {
      resetForm()
    }
  }, [event])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setLocation("")
    setDayOfWeek(1) // Monday
    setStartTime(new Time(9, 0))
    setEndTime(new Time(10, 0))
    setColor(Colors.GREEN)
    setError(null)
  }

  // Days of the week options
  const daysOfWeek = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
    { value: 7, label: "Domingo" },
  ]

  const handleSave = () => {
    if (!title.trim()) {
      setError("El título es requerido")
      return
    }

    setError(null)

    // Create dates based on day of week and times
    // Get a date for the selected day of week in current week
    const today = new Date()
    const currentDayOfWeek = today.getDay() === 0 ? 7 : today.getDay() // Convert to Monday-first
    const daysToAdd = dayOfWeek - currentDayOfWeek
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysToAdd)

    const startDateTime = new Date(targetDate)
    startDateTime.setHours(startTime.hour, startTime.minute, 0, 0)

    const endDateTime = new Date(targetDate)
    endDateTime.setHours(endTime.hour, endTime.minute, 0, 0)

    if (startDateTime >= endDateTime) {
      setError("La hora de inicio debe ser anterior a la hora de fin")
      return
    }

    const savedEvent: ScheduleEvents = {
      ...event,
      $id: event?.$id || "",
      title: title.trim(),
      description: description.trim() || null,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      location: location.trim() || null,
      color,
      schedule: event?.schedule || schedule,
    } as ScheduleEvents

    onSave(savedEvent)
    onClose()
    resetForm()
  }

  const handleDelete = () => {
    if (event?.$id && onDelete) {
      onDelete(event.$id)
      onClose()
      resetForm()
    }
  }

  const isEditing = !!event?.$id

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {isEditing ? "Editar evento" : "Crear evento"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Matemáticas I - Grupo 01"
              className="text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Información adicional sobre el evento..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Ubicación
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Edificio 401, Salón 201"
              className="text-sm"
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <Select
              value={color}
              onValueChange={(value) => setColor(value as Colors)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${getColorIndicator(color)}`}
                    />
                    <span className="capitalize">
                      {color.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.values(Colors).map((colorOption) => (
                  <SelectItem
                    key={colorOption}
                    value={colorOption}
                    className="text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${getColorIndicator(colorOption)}`}
                      />
                      <span className="capitalize">
                        {colorOption.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Day of Week */}
          <div className="space-y-2">
            <Label htmlFor="dayOfWeek" className="text-sm font-medium">
              Día de la semana
            </Label>
            <Select
              value={dayOfWeek.toString()}
              onValueChange={(value) => setDayOfWeek(Number(value))}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Selecciona un día" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day: { value: number; label: string }) => (
                  <SelectItem
                    key={day.value}
                    value={day.value.toString()}
                    className="text-sm"
                  >
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Start Time */}
            <TimeField
              value={startTime}
              onChange={(value) => {
                if (value) setStartTime(value)
              }}
              hourCycle={12}
            >
              <AriaLabel className="text-sm font-medium">
                Hora de inicio
              </AriaLabel>
              <div className="relative">
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3">
                  <ClockIcon size={16} aria-hidden="true" />
                </div>
                <DateInput className="ps-9" />
              </div>
            </TimeField>

            {/* End Time */}
            <TimeField
              value={endTime}
              onChange={(value) => {
                if (value) setEndTime(value)
              }}
              hourCycle={12}
            >
              <AriaLabel className="text-sm font-medium">Hora de fin</AriaLabel>
              <div className="relative">
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3">
                  <ClockIcon size={16} aria-hidden="true" />
                </div>
                <DateInput className="ps-9" />
              </div>
            </TimeField>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex-row justify-between gap-2">
          <div className="mr-auto flex items-center justify-start">
            {isEditing && onDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash />
              </Button>
            )}
          </div>
          <div className="flex w-auto justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Guardar" : "Crear"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
