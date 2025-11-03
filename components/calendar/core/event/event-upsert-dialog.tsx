"use client"

import { Time } from "@internationalized/date"
import { format, isBefore } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ClockIcon, Loader2, Trash } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { Label as AriaLabel } from "react-aria-components"
import { toast } from "sonner"

import {
  DefaultEndHour,
  DefaultStartHour,
} from "@/components/calendar/core/constants"
import { EventVisibilitySelector } from "@/components/calendar/core/event/event-visibility-selector"
import { EventImageUpload } from "@/components/event-image-upload"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { DateInput, TimeField } from "@/components/ui/datefield-rac"
import {
  Dialog,
  DialogContent,
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
import {
  saveCalendarEvent,
  type CalendarEventActionState,
} from "@/lib/actions/calendar/events"

import { cn, getColorIndicator } from "@/lib/utils"

import { getFacultyById } from "@/lib/data/faculties/getFacultyById"
import type {
  CalendarEtiquettes,
  CalendarEvents,
  Calendars,
  Faculties,
  Programs,
  Sedes,
} from "@/lib/data/types"

const initialState: CalendarEventActionState = {
  success: false,
  message: "",
}

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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [previousImage, setPreviousImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  // Estados para el nivel del evento
  const [eventLevel, setEventLevel] = useState<
    "nacional" | "sede" | "faculty" | "program"
  >("nacional")
  const [selectedSede, setSelectedSede] = useState<Sedes | null>(null)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculties | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<Programs | null>(null)

  const [state, formAction, isPending] = useActionState(
    saveCalendarEvent,
    initialState,
  )

  useEffect(() => {
    if (isOpen && event) {
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
      setImage(event.image || null)
      setPreviousImage(event.image || null)
      setImageFile(null)
      setError(null)

      // Configurar nivel del evento basado en los campos existentes
      if (calendar.slug === "unal") {
        if (event.program) {
          setEventLevel("program")
          setSelectedProgram(event.program)

          // Extraer sede y facultad del programa (relaciones de Appwrite)
          const programFaculty = event.program.faculty
          const facultySede = programFaculty?.sede

          // Si la sede no está poblada en la facultad, cargar la facultad completa
          if (programFaculty && !facultySede) {
            const loadFacultyWithSede = async () => {
              try {
                const facultyData = await getFacultyById(programFaculty.$id)
                setSelectedFaculty(facultyData)
                setSelectedSede(facultyData.sede || null)
              } catch (error) {
                console.error("Error loading faculty with sede:", error)
                setSelectedFaculty(programFaculty)
                setSelectedSede(null)
              }
            }
            void loadFacultyWithSede()
          } else {
            setSelectedFaculty(programFaculty || null)
            setSelectedSede(facultySede || null)
          }
        } else if (event.faculty) {
          setEventLevel("faculty")

          // Extraer sede de la facultad
          const facultySede = event.faculty.sede

          // Si la sede no está poblada en la facultad, cargar la facultad completa
          if (!facultySede) {
            const loadFacultyWithSede = async () => {
              try {
                const facultyData = await getFacultyById(event.faculty!.$id)
                setSelectedFaculty(facultyData)
                setSelectedSede(facultyData.sede || null)
              } catch (error) {
                console.error("Error loading faculty with sede:", error)
                setSelectedFaculty(event.faculty!)
                setSelectedSede(null)
              }
            }
            void loadFacultyWithSede()
          } else {
            setSelectedFaculty(event.faculty)
            setSelectedSede(facultySede)
          }

          setSelectedProgram(null)
        } else if (event.sede) {
          setEventLevel("sede")
          setSelectedSede(event.sede)
          setSelectedFaculty(null)
          setSelectedProgram(null)
        } else {
          setEventLevel("nacional")
          setSelectedSede(null)
          setSelectedFaculty(null)
          setSelectedProgram(null)
        }
      }
    } else if (isOpen && !event) {
      resetForm()
    }
  }, [isOpen, event, etiquettes])

  useEffect(() => {
    if (state.message) {
      if (state.success && state.data) {
        toast.success(state.message)
        onSave(state.data)
        onClose()
      } else if (!state.success && !state.errors) {
        toast.error(state.message)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

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
    setImage(null)
    setPreviousImage(null)
    setImageFile(null)
    setError(null)

    // Reset nuevos campos
    setEventLevel("nacional")
    setSelectedSede(null)
    setSelectedFaculty(null)
    setSelectedProgram(null)
  }

  const handleClose = () => {
    onClose()
  }

  // Crear una acción que agregue el archivo de imagen al FormData
  const formActionWithImage = async (formData: FormData) => {
    // Agregar el archivo de imagen si existe
    if (imageFile) {
      formData.set("image", imageFile)
    }
    return formAction(formData)
  }

  const handleDelete = () => {
    if (event?.$id) {
      onDelete(event.$id)
    }
  }

  const handleRemoveExistingImage = () => {
    setImage(null)
  }

  // Validar si el formulario es válido para enviar
  const isFormValid = () => {
    // Validar campos básicos
    if (!title.trim()) return false

    // Validar nivel organizacional para calendario unal
    if (calendar.slug === "unal") {
      if (eventLevel === "sede" && !selectedSede) return false
      if (eventLevel === "faculty" && (!selectedSede || !selectedFaculty))
        return false
      if (
        eventLevel === "program" &&
        (!selectedSede || !selectedFaculty || !selectedProgram)
      )
        return false
    }

    return true
  }

  // Preparar las fechas para el formulario
  const getStartDateTime = () => {
    const start = new Date(startDate)
    if (!allDay) {
      start.setHours(startTime.hour, startTime.minute, 0)
    } else {
      start.setHours(0, 0, 0, 0)
    }
    return start.toISOString()
  }

  const getEndDateTime = () => {
    const end = new Date(endDate)
    if (!allDay) {
      end.setHours(endTime.hour, endTime.minute, 0)
    } else {
      end.setHours(23, 59, 59, 999)
    }
    return end.toISOString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="flex max-w-md flex-col gap-0 p-0 sm:max-h-[min(800px,80vh)] sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            {event?.$id ? "Editar evento" : "Crear evento"}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-4">
          <form
            id="calendar-event-form"
            action={formActionWithImage}
            className="space-y-4"
          >
            {/* Campos ocultos */}
            <input type="hidden" name="calendar" value={calendar.$id} />
            {event?.$id && (
              <input type="hidden" name="eventId" value={event.$id} />
            )}
            <input type="hidden" name="start" value={getStartDateTime()} />
            <input type="hidden" name="end" value={getEndDateTime()} />
            <input type="hidden" name="all_day" value={allDay.toString()} />
            <input
              type="hidden"
              name="etiquette"
              value={etiquette?.$id || ""}
            />
            {/* Solo enviar el campo correspondiente al nivel seleccionado */}
            <input
              type="hidden"
              name="sede"
              value={eventLevel === "sede" ? selectedSede?.$id || "" : ""}
            />
            <input
              type="hidden"
              name="faculty"
              value={eventLevel === "faculty" ? selectedFaculty?.$id || "" : ""}
            />
            <input
              type="hidden"
              name="program"
              value={eventLevel === "program" ? selectedProgram?.$id || "" : ""}
            />
            <input type="hidden" name="currentImageId" value={image || ""} />
            <input
              type="hidden"
              name="previousImageId"
              value={previousImage || ""}
            />

            {/* Título */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="title" className="text-sm font-medium">
                  Título *
                </Label>
                <span className="text-muted-foreground text-xs">
                  {title.length}/100
                </span>
              </div>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                placeholder="Ej: Reunión de equipo"
                className="text-sm"
                maxLength={100}
                aria-invalid={state.errors?.title ? "true" : "false"}
                aria-describedby={
                  state.errors?.title ? "title-error" : undefined
                }
              />
              {state.errors?.title && (
                <p id="title-error" className="text-destructive text-sm">
                  {state.errors.title.join(", ")}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-sm font-medium">
                  Descripción
                </Label>
                <span className="text-muted-foreground text-xs">
                  {description.length}/3000
                </span>
              </div>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 3000))}
                placeholder="Información adicional sobre el evento..."
                rows={8}
                className="resize-none text-sm"
                maxLength={3000}
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

            {/* Ubicación */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="location" className="text-sm font-medium">
                  Ubicación
                </Label>
                <span className="text-muted-foreground text-xs">
                  {location.length}/200
                </span>
              </div>
              <Input
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value.slice(0, 200))}
                placeholder="Ej: Sala de conferencias"
                className="text-sm"
                maxLength={200}
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

            {/* Nivel del evento - Solo para calendario unal */}
            {calendar.slug === "unal" && (
              <EventVisibilitySelector
                value={eventLevel}
                onChange={setEventLevel}
                selectedSede={selectedSede}
                selectedFaculty={selectedFaculty}
                selectedProgram={selectedProgram}
                onSedeChange={setSelectedSede}
                onFacultyChange={setSelectedFaculty}
                onProgramChange={setSelectedProgram}
              />
            )}

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
                {/* Opción "Ninguna" */}
                <label
                  className={cn(
                    "relative flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                    !etiquette
                      ? "border-primary bg-primary/5"
                      : "border-input hover:bg-muted",
                  )}
                >
                  <RadioGroupItem value="none" className="sr-only" />
                  <div className="bg-muted size-3 rounded-full border border-gray-400" />
                  <span>Sin etiqueta</span>
                </label>

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

            {/* Imagen */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Imagen</Label>
              <EventImageUpload
                currentImage={image}
                onFileChange={setImageFile}
                onRemoveExisting={handleRemoveExistingImage}
              />
              {state.errors?.image && (
                <p className="text-destructive text-sm">
                  {state.errors.image.join(", ")}
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-3 border-t px-6 py-4">
          <div className="flex justify-between gap-2">
            <div className="flex items-center">
              {event?.$id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  <Trash />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="calendar-event-form"
                disabled={isPending || !isFormValid()}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>{event?.$id ? "Actualizar" : "Crear"}</>
                )}
              </Button>
            </div>
          </div>

          {/* Errores generales */}
          {state.errors?._form && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
              {state.errors._form.join(", ")}
            </div>
          )}

          {error && (
            <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
