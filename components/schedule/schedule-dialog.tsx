"use client"

import { Time } from "@internationalized/date"
import { ClockIcon, Loader2, Pencil, Plus } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { Label as AriaLabel } from "react-aria-components"
import { toast } from "sonner"

import { EventVisibilitySelector } from "@/components/calendar/core/event/event-visibility-selector"
import { Button } from "@/components/ui/button"
import { DateInput, TimeField } from "@/components/ui/datefield-rac"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  saveSchedule,
  type ScheduleActionState,
} from "@/lib/actions/schedule/schedules"

import type {
  Faculties,
  Programs,
  ScheduleCategories,
  Schedules,
  Sedes,
} from "@/lib/data/types"

const initialState: ScheduleActionState = {
  success: false,
  message: "",
}

type ScheduleDialogProps = {
  category: ScheduleCategories
  schedule?: Schedules
}

export function ScheduleDialog({ category, schedule }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(schedule?.name || "")
  const [description, setDescription] = useState(schedule?.description || "")
  const [startTime, setStartTime] = useState<Time>(new Time(6, 0))
  const [endTime, setEndTime] = useState<Time>(new Time(22, 0))
  const [error, setError] = useState<string | null>(null)

  // Estados para el nivel del horario
  const [scheduleLevel, setScheduleLevel] = useState<
    "nacional" | "sede" | "faculty" | "program"
  >("sede")
  const [selectedSede, setSelectedSede] = useState<Sedes | null>(null)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculties | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<Programs | null>(null)

  const [state, formAction, isPending] = useActionState(
    saveSchedule,
    initialState,
  )

  const validateHours = (start: Time, end: Time) => {
    const startHour = start.hour
    const endHour = end.hour

    // Calcular la diferencia considerando que puede cruzar medianoche
    let diff = endHour - startHour
    if (diff <= 0) {
      diff = 24 + diff // Si end es menor que start, cruza medianoche
    }

    if (diff < 5) {
      setError("El horario debe tener un mínimo de 5 horas")
      return false
    }
    setError(null)
    return true
  }

  useEffect(() => {
    if (open && schedule) {
      const start = schedule.start_hour ?? 6
      const end = schedule.end_hour ?? 22
      setName(schedule.name || "")
      setDescription(schedule.description || "")
      setStartTime(new Time(start, 0))
      setEndTime(new Time(end, 0))
      setError(null)
      validateHours(new Time(start, 0), new Time(end, 0))

      // Configurar nivel del schedule basado en los campos existentes
      if (schedule.program) {
        setScheduleLevel("program")

        // Establecer en orden: sede -> facultad -> programa
        const faculty = schedule.program.faculty
        const sede = faculty?.sede || schedule.sede

        setSelectedSede(sede || null)
        setSelectedFaculty(faculty || null)
        setSelectedProgram(schedule.program)
      } else if (schedule.faculty) {
        setScheduleLevel("faculty")

        // Establecer en orden: sede -> facultad
        setSelectedSede(schedule.faculty.sede || schedule.sede || null)
        setSelectedFaculty(schedule.faculty)
        setSelectedProgram(null)
      } else if (schedule.sede) {
        setScheduleLevel("sede")
        setSelectedSede(schedule.sede)
        setSelectedFaculty(null)
        setSelectedProgram(null)
      } else {
        setScheduleLevel("nacional")
        setSelectedSede(null)
        setSelectedFaculty(null)
        setSelectedProgram(null)
      }
    } else if (open && !schedule) {
      setName("")
      setDescription("")
      setStartTime(new Time(6, 0))
      setEndTime(new Time(22, 0))
      setError(null)

      // Reset niveles
      setScheduleLevel("sede")
      setSelectedSede(null)
      setSelectedFaculty(null)
      setSelectedProgram(null)
    }
  }, [open, schedule])

  // Manejar cambios en las horas con validación
  const handleStartTimeChange = (time: Time | null) => {
    if (time) {
      setStartTime(time)
      validateHours(time, endTime)
    }
  }

  const handleEndTimeChange = (time: Time | null) => {
    if (time) {
      setEndTime(time)
      validateHours(startTime, time)
    }
  }

  useEffect(() => {
    if (state.message) {
      if (state.success && state.data) {
        toast.success(state.message)
        setOpen(false)
        setName("")
        setDescription("")
        setStartTime(new Time(6, 0))
        setEndTime(new Time(22, 0))
        setError(null)
      } else if (!state.success && !state.errors) {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {schedule ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar horario</span>
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Horario
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-w-md flex-col gap-0 p-0 sm:max-w-[500px] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <div className="border-b px-6 py-4">
            <DialogTitle className="text-base">
              {schedule ? "Editar horario" : "Crear nuevo horario"}
            </DialogTitle>
            <DialogDescription className="mt-1.5">
              {schedule
                ? "Actualiza los datos del horario"
                : `Crea un nuevo horario para ${category.name}`}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-4">
          <form id="schedule-form" action={formAction} className="space-y-4">
            {/* Campos ocultos */}
            <input type="hidden" name="category" value={category.$id} />
            <input
              type="hidden"
              name="categoryData"
              value={JSON.stringify(category)}
            />
            {schedule && (
              <input
                type="hidden"
                name="schedule"
                value={JSON.stringify(schedule)}
              />
            )}
            <input type="hidden" name="start_hour" value={startTime.hour} />
            <input type="hidden" name="end_hour" value={endTime.hour} />
            {/* Solo enviar el campo correspondiente al nivel seleccionado */}
            <input
              type="hidden"
              name="sede"
              value={scheduleLevel === "sede" ? selectedSede?.$id || "" : ""}
            />
            <input
              type="hidden"
              name="faculty"
              value={
                scheduleLevel === "faculty" ? selectedFaculty?.$id || "" : ""
              }
            />
            <input
              type="hidden"
              name="program"
              value={
                scheduleLevel === "program" ? selectedProgram?.$id || "" : ""
              }
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name">Nombre *</Label>
                <span className="text-muted-foreground text-xs">
                  {name.length}/100
                </span>
              </div>
              <Input
                id="name"
                name="name"
                placeholder="Ej: Primer Semestre 2025"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 100))}
                disabled={isPending}
                maxLength={100}
                aria-invalid={state.errors?.name ? "true" : "false"}
                aria-describedby={state.errors?.name ? "name-error" : undefined}
              />
              {state.errors?.name && (
                <p id="name-error" className="text-destructive text-sm">
                  {state.errors.name.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Descripción</Label>
                <span className="text-muted-foreground text-xs">
                  {description.length}/500
                </span>
              </div>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe brevemente este horario..."
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                disabled={isPending}
                rows={3}
                maxLength={500}
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

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Hora de inicio */}
                <TimeField
                  value={startTime}
                  onChange={handleStartTimeChange}
                  hourCycle={12}
                  granularity="hour"
                  isDisabled={isPending}
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

                {/* Hora de fin */}
                <TimeField
                  value={endTime}
                  onChange={handleEndTimeChange}
                  hourCycle={12}
                  granularity="hour"
                  isDisabled={isPending}
                >
                  <AriaLabel className="text-sm font-medium">
                    Hora de fin
                  </AriaLabel>
                  <div className="relative">
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3">
                      <ClockIcon size={16} aria-hidden="true" />
                    </div>
                    <DateInput className="ps-9" />
                  </div>
                </TimeField>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <p className="text-muted-foreground text-xs">
                Rango de horas visible en el horario. Los eventos solo podrán
                crearse dentro de este rango. Mínimo 5 horas.
              </p>
            </div>

            {/* Selector de visibilidad */}
            <EventVisibilitySelector
              value={scheduleLevel}
              onChange={setScheduleLevel}
              selectedSede={selectedSede}
              selectedFaculty={selectedFaculty}
              selectedProgram={selectedProgram}
              onSedeChange={setSelectedSede}
              onFacultyChange={setSelectedFaculty}
              onProgramChange={setSelectedProgram}
            />
          </form>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <div className="flex w-full justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="schedule-form"
              disabled={isPending || !!error}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>{schedule ? "Actualizar" : "Crear"}</>
              )}
            </Button>
          </div>
        </DialogFooter>
        {/* Errores generales */}
        {state.errors?._form && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 m-2 rounded-md border p-3 text-sm">
            {state.errors._form.join(", ")}
          </div>
        )}

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
