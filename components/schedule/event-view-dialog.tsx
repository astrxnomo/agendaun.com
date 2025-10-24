"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, FileText, MapPin } from "lucide-react"

import { getColor } from "@/components/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import type { ScheduleEvents } from "@/lib/appwrite/types"

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

  const startDate = new Date(event.start_time)
  const endDate = new Date(event.end_time)

  // Get day name in Spanish
  const dayName = format(startDate, "EEEE", { locale: es })

  // Get color for the icon background
  const eventColor = getColor(event.color)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
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

        <div className="space-y-4">
          {/* Fecha y hora */}
          <div className="flex items-start gap-3">
            <Clock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Horario</p>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p className="capitalize">
                  {dayName}, {format(startDate, "h:mm a", { locale: es })} -{" "}
                  {format(endDate, "h:mm a", { locale: es })}
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
      </DialogContent>
    </Dialog>
  )
}
