import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, FileText, MapPin, Tag } from "lucide-react"

import { EventImage } from "@/components/schedule/event-image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn, formatTime, getColor, getColorIndicator } from "@/lib/utils"

import type { CalendarEvents } from "@/lib/data/types"

interface EventViewDialogProps {
  event: CalendarEvents | null
  isOpen: boolean
  onClose: () => void
}

export function EventViewDialog({
  event,
  isOpen,
  onClose,
}: EventViewDialogProps) {
  if (!event) return null

  const startDate = new Date(event.start)
  const endDate = new Date(event.end)
  const isSameDay =
    format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-md", event.image && "sm:max-w-3xl")}>
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded",
                event.etiquette?.color
                  ? getColor(event.etiquette.color)
                  : "bg-muted",
              )}
            >
              <Calendar className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-left text-lg leading-tight font-semibold">
                {event.title}
              </DialogTitle>
              {event.all_day ? (
                <p className="text-muted-foreground mt-1 text-sm">
                  Todo el día
                </p>
              ) : (
                <p className="text-muted-foreground mt-1 text-sm">
                  {formatTime(startDate.getHours(), startDate.getMinutes())} -{" "}
                  {formatTime(endDate.getHours(), endDate.getMinutes())}
                </p>
              )}
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
            {/* Fecha */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="text-muted-foreground size-4" />
                <p className="text-sm font-medium">Fecha</p>
              </div>
              <div className="pl-6 capitalize">
                {isSameDay ? (
                  <p className="text-muted-foreground text-sm">
                    {format(startDate, "PPPP", { locale: es })}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {format(startDate, "PPP", { locale: es })} -{" "}
                    {format(endDate, "PPP", { locale: es })}
                  </p>
                )}
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
            {/* Etiqueta */}
            {event.etiquette && (
              <>
                <Separator />
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Tag className="text-muted-foreground size-4" />
                    <p className="text-sm font-medium">Etiqueta</p>
                  </div>
                  <div className="flex items-center gap-2 pl-6">
                    <div
                      className={cn(
                        "size-3 rounded-full border border-gray-400",
                        getColorIndicator(event.etiquette.color),
                      )}
                    />
                    <span className="text-muted-foreground text-sm">
                      {event.etiquette.name}
                    </span>
                  </div>
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
