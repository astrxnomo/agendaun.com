"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar1, Clock, MapPin, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import type { CalendarEvent } from "@/components/calendar/types"

interface EventViewDialogProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  calendarType?: "personal" | "national" | "department" | "public" | "facultad"
}

const calendarTypeLabels = {
  personal: "Personal",
  national: "Nacional",
  department: "Departamental",
  public: "Público",
  facultad: "Facultad",
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  violet: "bg-violet-100 text-violet-800 border-violet-200",
  rose: "bg-rose-100 text-rose-800 border-rose-200",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
  red: "bg-red-100 text-red-800 border-red-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  green: "bg-green-100 text-green-800 border-green-200",
  cyan: "bg-cyan-100 text-cyan-800 border-cyan-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  pink: "bg-pink-100 text-pink-800 border-pink-200",
  indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
  teal: "bg-teal-100 text-teal-800 border-teal-200",
  lime: "bg-lime-100 text-lime-800 border-lime-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
}

export function EventViewDialog({
  event,
  isOpen,
  onClose,
  calendarType = "public",
}: EventViewDialogProps) {
  if (!event) return null

  const startDate = new Date(event.start)
  const endDate = new Date(event.end)
  const colorClass = event.color ? colorClasses[event.color] : colorClasses.blue

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full border",
                colorClass,
              )}
            >
              <Calendar1 className="size-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">{event.title}</DialogTitle>
              <DialogDescription className="text-left">
                Evento del calendario {calendarTypeLabels[calendarType]}
              </DialogDescription>
            </div>
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
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "size-3 rounded-full border",
                  event.color === "blue" && "border-blue-600 bg-blue-500",
                  event.color === "orange" && "border-orange-600 bg-orange-500",
                  event.color === "violet" && "border-violet-600 bg-violet-500",
                  event.color === "rose" && "border-rose-600 bg-rose-500",
                  event.color === "emerald" &&
                    "border-emerald-600 bg-emerald-500",
                  event.color === "red" && "border-red-600 bg-red-500",
                  event.color === "yellow" && "border-yellow-600 bg-yellow-500",
                  event.color === "green" && "border-green-600 bg-green-500",
                  event.color === "cyan" && "border-cyan-600 bg-cyan-500",
                  event.color === "purple" && "border-purple-600 bg-purple-500",
                  event.color === "pink" && "border-pink-600 bg-pink-500",
                  event.color === "indigo" && "border-indigo-600 bg-indigo-500",
                  event.color === "teal" && "border-teal-600 bg-teal-500",
                  event.color === "lime" && "border-lime-600 bg-lime-500",
                  event.color === "amber" && "border-amber-600 bg-amber-500",
                )}
              />
              <Badge variant="secondary" className={cn("text-xs", colorClass)}>
                {event.label || "Evento"}
              </Badge>
            </div>
          )}

          {/* Información del calendario */}
          <Separator />
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <User className="size-3" />
            <span>Calendario {calendarTypeLabels[calendarType]}</span>
            {calendarType === "national" && (
              <Badge variant="outline" className="text-xs">
                Solo lectura
              </Badge>
            )}
          </div>
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
