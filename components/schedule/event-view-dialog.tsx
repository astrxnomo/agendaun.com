import { EventImage } from "@/components/schedule/event-image"
import { Calendar, Clock, FileText, MapPin } from "lucide-react"

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
      <DialogContent className={cn("max-w-lg", event.image && "sm:max-w-2xl")}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full border",
                eventColor,
              )}
            >
              <Calendar className="size-5" />
            </div>
            <DialogTitle className="text-left text-base font-semibold sm:text-lg">
              {event.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className={cn(event.image && "flex flex-col gap-6 sm:flex-row")}>
          <div className={cn("space-y-4", event.image && "flex-1")}>
            {/* Fecha y hora */}
            <div className="flex items-start gap-3">
              <Clock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Horario</p>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p className="capitalize">
                    {dayNames.length === 7
                      ? "Todos los días"
                      : dayNames.join(", ")}
                  </p>
                  <p>
                    {formatTime(event.start_hour, event.start_minute)} -{" "}
                    {formatTime(event.end_hour, event.end_minute)}
                  </p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ubicación</p>
                  <p className="text-muted-foreground text-sm">
                    {event.location}
                  </p>
                </div>
              </div>
            )}

            {/* Descripción */}
            {event.description && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <FileText className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div className="flex-1">
                    <p className="mb-2 text-sm font-medium">Descripción</p>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Imagen */}
          {event.image && (
            <EventImage
              src={event.image}
              alt={event.title}
              width={256}
              height={160}
              wrapperClassName="flex-shrink-0 sm:w-64"
              className="h-auto w-full rounded-lg object-cover"
              skeletonClassName="h-40 w-full rounded-lg"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
