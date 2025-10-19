"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {event.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Time */}
          <div className="flex items-start gap-3">
            <Clock className="text-muted-foreground mt-0.5 size-4" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Horario</p>
              <div className="text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3" />
                  <span>
                    {format(startDate, "EEEE, dd 'de' MMMM", { locale: es })}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Clock className="size-3" />
                  <span>
                    {format(startDate, "h:mm a", { locale: es })} -{" "}
                    {format(endDate, "h:mm a", { locale: es })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="text-muted-foreground mt-0.5 size-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Ubicación</p>
                <p className="text-muted-foreground text-sm">
                  {event.location}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="flex items-start gap-3">
              <div className="text-muted-foreground mt-0.5 flex size-4 items-center justify-center">
                <div className="size-2 rounded-full bg-current" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Descripción</p>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
