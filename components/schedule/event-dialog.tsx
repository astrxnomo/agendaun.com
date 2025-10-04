"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
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

import type { ScheduleEvents, Schedules } from "@/types"

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
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [location, setLocation] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (event) {
      setTitle(event.title || "")
      setDescription(event.description || "")
      setLocation(event.location || "")

      if (event.start_time) {
        const startDateTime = new Date(event.start_time)
        // Convert JavaScript day (0 = Sunday) to Monday-first (1 = Monday)
        const jsDay = startDateTime.getDay()
        const mondayFirstDay = jsDay === 0 ? 7 : jsDay
        setDayOfWeek(mondayFirstDay)
        setStartTime(formatTimeForInput(startDateTime))
      }

      if (event.end_time) {
        const endDateTime = new Date(event.end_time)
        setEndTime(formatTimeForInput(endDateTime))
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
    setStartTime("09:00")
    setEndTime("10:00")
    setError(null)
  }

  const formatTimeForInput = (date: Date) => {
    return format(date, "HH:mm")
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

  // Generate time options (every 15 minutes)
  const timeOptions = useMemo(() => {
    const options = []
    for (let hour = 6; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
        const displayTime = format(
          new Date(2024, 0, 1, hour, minute),
          "h:mm a",
          { locale: es },
        )
        options.push({ value: timeString, label: displayTime })
      }
    }
    return options
  }, [])

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

    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const startDateTime = new Date(targetDate)
    startDateTime.setHours(startHour, startMinute, 0, 0)

    const endDateTime = new Date(targetDate)
    endDateTime.setHours(endHour, endMinute, 0, 0)

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
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Horario" : "Crear Horario"}
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
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Matemáticas I - Grupo 01"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Información adicional sobre el horario..."
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Edificio 401, Salón 201"
            />
          </div>

          <Separator />

          {/* Day of Week */}
          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Día de la semana</Label>
            <Select
              value={dayOfWeek.toString()}
              onValueChange={(value) => setDayOfWeek(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un día" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day: { value: number; label: string }) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div className="space-y-2">
              <Label>Hora de inicio</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue />
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

            {/* End Time */}
            <div className="space-y-2">
              <Label>Hora de fin</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue />
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
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {isEditing && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:flex-1"
            >
              Eliminar
            </Button>
          )}
          <div className="flex w-full gap-2 sm:flex-1">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {isEditing ? "Guardar" : "Crear"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
