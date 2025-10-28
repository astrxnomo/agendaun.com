"use client"

import { Time } from "@internationalized/date"
import { ClockIcon, Trash } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { Label as AriaLabel } from "react-aria-components"
import { toast } from "sonner"

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
import { saveEvent, type EventActionState } from "@/lib/actions/schedule/events"
import { Colors } from "@/lib/data/types"

import type { ScheduleEvents, Schedules } from "@/lib/data/types"
import { getColorIndicator } from "@/lib/utils"

interface ScheduleEventDialogProps {
  schedule: Schedules
  event: ScheduleEvents | Partial<ScheduleEvents> | null
  isOpen: boolean
  onClose: () => void
  onSave: (event: ScheduleEvents) => void
  onDelete?: (eventId: string) => void
}

const initialState: EventActionState = {
  success: false,
  message: "",
}

export function ScheduleEventDialog({
  schedule,
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: ScheduleEventDialogProps) {
  // Estados controlados del formulario
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startTime, setStartTime] = useState<Time>(new Time(9, 0))
  const [endTime, setEndTime] = useState<Time>(new Time(10, 0))
  const [selectedDays, setSelectedDays] = useState<number[]>([1])
  const [color, setColor] = useState<Colors>(Colors.GREEN)

  const [state, formAction, isPending] = useActionState(saveEvent, initialState)

  useEffect(() => {
    if (isOpen && event) {
      // Cargar datos del evento existente
      setTitle(event.title || "")
      setDescription(event.description || "")
      setLocation(event.location || "")
      if (event.days_of_week && event.days_of_week.length > 0) {
        setSelectedDays(event.days_of_week)
      }
      setStartTime(new Time(event.start_hour ?? 9, event.start_minute ?? 0))
      setEndTime(new Time(event.end_hour ?? 10, event.end_minute ?? 0))
      setColor(event.color || Colors.GREEN)
    } else if (isOpen && !event) {
      // Resetear para evento nuevo
      setTitle("")
      setDescription("")
      setLocation("")
      setSelectedDays([1])
      setStartTime(new Time(9, 0))
      setEndTime(new Time(10, 0))
      setColor(Colors.GREEN)
    }
  }, [isOpen, event])

  useEffect(() => {
    if (state.message) {
      if (state.success && state.data) {
        toast.success(state.message)
        onSave(state.data)
      } else if (!state.success && !state.errors) {
        toast.error(state.message)
      }
    }
  }, [state, onSave])

  const daysOfWeek = [
    { value: 1, label: "Lunes", short: "L" },
    { value: 2, label: "Martes", short: "M" },
    { value: 3, label: "Miércoles", short: "M" },
    { value: 4, label: "Jueves", short: "J" },
    { value: 5, label: "Viernes", short: "V" },
    { value: 6, label: "Sábado", short: "S" },
    { value: 7, label: "Domingo", short: "D" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {event?.$id ? "Editar evento" : "Crear evento"}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {/* Campos ocultos */}
          <input type="hidden" name="schedule" value={schedule.$id} />
          {event?.$id && (
            <input type="hidden" name="eventId" value={event.$id} />
          )}
          <input
            type="hidden"
            name="days_of_week"
            value={JSON.stringify(selectedDays)}
          />
          <input type="hidden" name="start_hour" value={startTime.hour} />
          <input type="hidden" name="start_minute" value={startTime.minute} />
          <input type="hidden" name="end_hour" value={endTime.hour} />
          <input type="hidden" name="end_minute" value={endTime.minute} />
          <input type="hidden" name="color" value={color} />

          {/* Errores generales */}
          {state.errors?._form && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
              {state.errors._form.join(", ")}
            </div>
          )}

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título *
            </Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Matemáticas I - Grupo 01"
              className="text-sm"
              aria-invalid={state.errors?.title ? "true" : "false"}
              aria-describedby={state.errors?.title ? "title-error" : undefined}
            />
            {state.errors?.title && (
              <p id="title-error" className="text-destructive text-sm">
                {state.errors.title.join(", ")}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción
            </Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Información adicional sobre el evento..."
              rows={3}
              className="resize-none text-sm"
              aria-invalid={state.errors?.description ? "true" : "false"}
              aria-describedby={
                state.errors?.description ? "description-error" : undefined
              }
            />
            {state.errors?.description && (
              <p id="description-error" className="text-destructive text-sm">
                {state.errors.description.join(", ")}
              </p>
            )}
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Ubicación
            </Label>
            <Input
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Edificio A - Salón 201"
              className="text-sm"
              aria-invalid={state.errors?.location ? "true" : "false"}
              aria-describedby={
                state.errors?.location ? "location-error" : undefined
              }
            />
            {state.errors?.location && (
              <p id="location-error" className="text-destructive text-sm">
                {state.errors.location.join(", ")}
              </p>
            )}
          </div>

          {/* Días de la semana */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Días de la semana *</Label>
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
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    title={day.label}
                    aria-label={day.label}
                    aria-pressed={isSelected}
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
            {state.errors?.days_of_week && (
              <p className="text-destructive text-center text-sm">
                {state.errors.days_of_week.join(", ")}
              </p>
            )}
          </div>

          {/* Horario */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Hora de inicio */}
            <TimeField
              value={startTime}
              onChange={(time) => {
                if (time) setStartTime(time)
              }}
              hourCycle={12}
            >
              <AriaLabel className="text-sm font-medium">
                Hora de inicio *
              </AriaLabel>
              <div className="relative">
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3">
                  <ClockIcon size={16} aria-hidden="true" />
                </div>
                <DateInput className="ps-9" />
              </div>
            </TimeField>

            {/* Hora de fin */}
            <TimeField
              value={endTime}
              onChange={(time) => {
                if (time) setEndTime(time)
              }}
              hourCycle={12}
            >
              <AriaLabel className="text-sm font-medium">
                Hora de fin *
              </AriaLabel>
              <div className="relative">
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3">
                  <ClockIcon size={16} aria-hidden="true" />
                </div>
                <DateInput className="ps-9" />
              </div>
            </TimeField>
          </div>
          {state.errors?.start_hour && (
            <p className="text-destructive text-sm">
              {state.errors.start_hour.join(", ")}
            </p>
          )}
          {state.errors?.end_hour && (
            <p className="text-destructive text-sm">
              {state.errors.end_hour.join(", ")}
            </p>
          )}

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

          <DialogFooter className="flex-row justify-between gap-2">
            <div className="mr-auto flex items-center justify-start">
              {event?.$id && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onDelete(event.$id!)}
                >
                  <Trash />
                </Button>
              )}
            </div>
            <div className="flex w-auto justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : event?.$id ? "Guardar" : "Crear"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
