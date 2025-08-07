"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar1, Clock, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { getEtiquetteColor } from "./utils"

import type { CalendarEvent, Etiquette } from "@/components/calendar/types"

interface EventViewDialogProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  etiquettes?: Etiquette[] // ← Nueva prop para etiquetas disponibles
}

export function EventViewDialog({
  event,
  isOpen,
  onClose,
  etiquettes: etiquettes = [], // ← Prefijo underscore para indicar que no se usa aún
}: EventViewDialogProps) {
  if (!event) return null

  const startDate = new Date(event.start)
  const endDate = new Date(event.end)

  const etiquetteColor = getEtiquetteColor(event.color)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full border",
                etiquetteColor,
              )}
            >
              <Calendar1 className="size-5" />
            </div>
            <DialogTitle className="text-left text-lg font-semibold">
              {event.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Fecha y hora */}
          <div className="flex items-start gap-3">
            <Clock className="text-muted-foreground mt-0.5 size-4" />
            <div className="flex-1">
              <p className="text-sm font-medium">Fecha y hora</p>
              <div className="text-muted-foreground text-sm">
                {event.allDay ? (
                  <p>
                    {format(startDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                    <span className="ml-2 text-xs">Todo el día</span>
                  </p>
                ) : (
                  <div>
                    <p className="capitalize">
                      {format(startDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                        locale: es,
                      })}
                    </p>
                    <p>
                      {format(startDate, "HH:mm", { locale: es })} -{" "}
                      {format(endDate, "HH:mm", { locale: es })}
                      {format(startDate, "yyyy-MM-dd") !==
                        format(endDate, "yyyy-MM-dd") && (
                        <span className="ml-1">
                          (+ {format(endDate, "d 'de' MMMM", { locale: es })})
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ubicación */}
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="text-muted-foreground mt-0.5 size-4" />
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
              <div>
                <p className="mb-2 text-sm font-medium">Descripción</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            </>
          )}

          {/* Etiqueta de color */}
          {event.color && (
            <>
              <Separator />
              <Badge
                variant="secondary"
                className={cn("border text-xs capitalize", etiquetteColor)}
              >
                {etiquettes.find((etiquette) => etiquette.color === event.color)
                  ?.name || "Sin etiqueta"}
              </Badge>
            </>
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
