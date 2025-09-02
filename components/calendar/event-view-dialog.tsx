"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar1, Clock, MapPin } from "lucide-react"

import { getEtiquetteColor } from "@/components/calendar"
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

import type { Etiquettes, Events } from "@/types"

interface EventViewDialogProps {
  event: Events | null
  isOpen: boolean
  onClose: () => void
  etiquettes?: Etiquettes[] // ← Nueva prop para etiquetas disponibles
}

export function EventViewDialog({
  event,
  etiquettes = [],
  isOpen,
  onClose,
}: EventViewDialogProps) {
  if (!event) return null

  const startDate = new Date(event.start)
  const endDate = new Date(event.end)

  const eventColor = getEtiquetteColor(event.etiquette.color)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full border",
                eventColor,
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
                {event.all_day ? (
                  <p>
                    {format(startDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                    <span className="ml-2 text-xs">Todo el día</span>
                  </p>
                ) : (
                  <div>
                    <p className="capitalize">
                      {format(startDate, "yyyy-MM-dd") !==
                        format(endDate, "yyyy-MM-dd") && "Inicia: "}
                      {format(startDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                        locale: es,
                      })}
                    </p>
                    <p className="capitalize">
                      {format(startDate, "yyyy-MM-dd") !==
                        format(endDate, "yyyy-MM-dd") && (
                        <span>
                          Finaliza:{" "}
                          {format(endDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                            locale: es,
                          })}
                        </span>
                      )}
                    </p>
                    <p>
                      {format(startDate, "hh:mm a", { locale: es })} -{" "}
                      {format(endDate, "hh:mm a", { locale: es })}
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
          {eventColor && (
            <>
              <Separator />
              <Badge
                variant="secondary"
                className={cn("border text-xs", eventColor)}
              >
                {etiquettes.find(
                  (etiquette) => etiquette.$id === event.etiquette?.$id,
                )?.name || "Sin etiqueta"}
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
