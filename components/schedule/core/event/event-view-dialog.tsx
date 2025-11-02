import { EventImage } from "@/components/schedule/core/event/event-image"
import { Calendar, FileText, MapPin } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn, formatTime, getColor } from "@/lib/utils"

import type { ScheduleEvents } from "@/lib/data/types"

interface ScheduleEventViewDialogProps {
  event: ScheduleEvents | null
  isOpen: boolean
  onClose: () => void
}

export function ScheduleEventViewDialog({
  event,
  isOpen,
  onClose,
}: ScheduleEventViewDialogProps) {
  if (!event) return null

  const daysMap: { [key: number]: string } = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
  }
  const dayNames = event.days_of_week.map((d) => daysMap[d])

  const eventColor = getColor(event.color)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-md", event.image && "sm:max-w-3xl")}>
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded",
                eventColor,
              )}
            >
              <Calendar className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-left text-lg leading-tight font-semibold">
                {event.title}
              </DialogTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {formatTime(event.start_hour, event.start_minute)} -{" "}
                {formatTime(event.end_hour, event.end_minute)}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Contenido principal */}
        <div
          className={cn(
            "space-y-5",
            event.image && "sm:flex sm:gap-6 sm:space-y-0",
          )}
        >
          {/* Información del evento */}
          <div className="space-y-5 sm:flex-1">
            {/* Días de la semana */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="text-muted-foreground size-4" />
                <p className="text-sm font-medium">Días</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dayNames.map((day) => (
                  <span
                    key={day}
                    className="text-muted-foreground inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Ubicación */}
            {event.location && (
              <>
                <Separator />
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="text-muted-foreground size-4" />
                    <p className="text-sm font-medium">Ubicación</p>
                  </div>
                  <p className="text-muted-foreground pl-6 text-sm">
                    {event.location}
                  </p>
                </div>
              </>
            )}

            {/* Descripción */}
            {event.description && (
              <>
                <Separator />
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="text-muted-foreground size-4" />
                    <p className="text-sm font-medium">Descripción</p>
                  </div>
                  <p className="text-muted-foreground pl-6 text-sm leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Imagen */}
          {event.image && (
            <>
              <Separator
                orientation="vertical"
                className="hidden h-auto sm:block"
              />
              <div className="sm:w-70 sm:shrink-0">
                <EventImage
                  src={event.image}
                  alt={event.title}
                  width={208}
                  height={208}
                  wrapperClassName="overflow-hidden rounded"
                  className="h-auto w-full object-cover"
                  skeletonClassName="aspect-square w-full"
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
