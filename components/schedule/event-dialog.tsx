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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  const [selectedDays, setSelectedDays] = useState<number[]>([1]) // Array de días seleccionados
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

      // Usar los campos de días y horas
      if (event.days_of_week && event.days_of_week.length > 0) {
        setSelectedDays(event.days_of_week)
      } else {
        setSelectedDays([1]) // Default: Lunes
      }

      setStartTime(new Time(event.start_hour ?? 9, event.start_minute ?? 0))
      setEndTime(new Time(event.end_hour ?? 10, event.end_minute ?? 0))
    } else {
      resetForm()
    }
  }, [event])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setLocation("")
    setSelectedDays([1]) // Lunes por defecto
    setStartTime(new Time(9, 0))
    setEndTime(new Time(10, 0))
    setColor(Colors.GREEN)
    setError(null)
  }

  // Days of the week options
  const daysOfWeek = [
    { value: 1, label: "Lunes", short: "L" },
    { value: 2, label: "Martes", short: "M" },
    { value: 3, label: "Miércoles", short: "M" },
    { value: 4, label: "Jueves", short: "J" },
    { value: 5, label: "Viernes", short: "V" },
    { value: 6, label: "Sábado", short: "S" },
    { value: 7, label: "Domingo", short: "D" },
  ]

  const handleSave = () => {
    if (!title.trim()) {
      setError("El título es requerido")
      return
    }

    if (selectedDays.length === 0) {
      setError("Debes seleccionar al menos un día")
      return
    }

    setError(null)

    // Validar que la hora de inicio sea antes que la de fin
    if (
      startTime.hour > endTime.hour ||
      (startTime.hour === endTime.hour && startTime.minute >= endTime.minute)
    ) {
      setError("La hora de inicio debe ser anterior a la hora de fin")
      return
    }

    const savedEvent: ScheduleEvents = {
      ...event,
      $id: event?.$id || "",
      title: title.trim(),
      description: description.trim() || null,
      // Campos de días y horarios
      days_of_week: selectedDays,
      start_hour: startTime.hour,
      start_minute: startTime.minute,
      end_hour: endTime.hour,
      end_minute: endTime.minute,
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
            <RadioGroup
              value={color}
              onValueChange={(value) => setColor(value as Colors)}
              className="bg-muted/30 flex flex-wrap justify-center gap-3 rounded-lg p-3"
            >
              {Object.values(Colors).map((colorOption) => (
                <div key={colorOption} className="relative">
                  <RadioGroupItem
                    value={colorOption}
                    id={`color-${colorOption}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`color-${colorOption}`}
                    className={`block h-5 w-5 cursor-pointer rounded-full transition-all duration-200 ${getColorIndicator(colorOption)} ${
                      color === colorOption
                        ? "ring-foreground/20 ring-offset-background scale-125 shadow-lg ring-2 ring-offset-2"
                        : "hover:scale-110 hover:shadow-md"
                    }`}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Days of Week - Multiple Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Días de la semana</Label>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDays.includes(day.value)
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDays(
                          selectedDays.filter((d) => d !== day.value),
                        )
                      } else {
                        setSelectedDays([...selectedDays, day.value].sort())
                      }
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    title={day.label}
                  >
                    {day.short}
                  </button>
                )
              })}
            </div>
            {selectedDays.length > 0 && (
              <p className="text-muted-foreground text-center text-xs">
                {selectedDays.length === 7
                  ? "Todos los días"
                  : `${selectedDays.length} día${selectedDays.length > 1 ? "s" : ""} seleccionado${selectedDays.length > 1 ? "s" : ""}`}
              </p>
            )}
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
