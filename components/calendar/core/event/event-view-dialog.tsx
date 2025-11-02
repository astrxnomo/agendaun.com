import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Calendar,
  FileText,
  Globe,
  GraduationCap,
  MapPin,
  School,
  Tag,
  University,
} from "lucide-react"

import { EventImage } from "@/components/schedule/core/event/event-image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
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
      <DialogContent
        className={cn(
          "flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] [&>button:last-child]:top-3.5",
          event.image ? "sm:max-w-3xl" : "max-w-md",
        )}
      >
        {/* Header */}
        <DialogHeader className="contents space-y-0 text-left">
          <div className="border-b px-6 py-4">
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
          </div>
        </DialogHeader>

        {/* Contenido principal */}
        <div
          className={cn(
            "flex min-h-0 flex-1",
            event.image ? "flex-col sm:flex-row sm:divide-x" : "flex-col",
          )}
        >
          {/* Información del evento - con scroll */}
          <ScrollArea className="min-w-0 flex-1">
            <div className="space-y-5 px-6 py-4">
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

              {/* Imagen en móvil */}
              {event.image && (
                <>
                  <Separator className="sm:hidden" />
                  <div className="sm:hidden">
                    <EventImage
                      src={event.image}
                      alt={event.title}
                      width={400}
                      height={400}
                      wrapperClassName="overflow-hidden rounded-lg"
                      className="h-auto w-full object-cover"
                      skeletonClassName="aspect-square w-full"
                    />
                  </div>
                </>
              )}

              {/* Visibilidad - al final */}
              {event.calendar?.slug === "unal" && (
                <>
                  <Separator />

                  <div className="space-y-2">
                    {event.sede || event.faculty || event.program ? (
                      <>
                        {event.sede && (
                          <div className="flex items-center gap-2">
                            <School className="text-muted-foreground size-3.5 shrink-0" />
                            <span className="text-muted-foreground text-xs">
                              {event.sede.name}
                            </span>
                          </div>
                        )}
                        {event.faculty && (
                          <div className="flex items-center gap-2">
                            <University className="text-muted-foreground size-3.5 shrink-0" />
                            <span className="text-muted-foreground text-xs">
                              {event.faculty.name}
                            </span>
                          </div>
                        )}
                        {event.program && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="text-muted-foreground size-3.5 shrink-0" />
                            <span className="text-muted-foreground text-xs">
                              {event.program.name}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Globe className="text-muted-foreground size-3.5 shrink-0" />
                        <span className="text-muted-foreground text-xs">
                          Nacional
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {event.image && (
            <div className="hidden sm:flex sm:w-80 sm:shrink-0 sm:items-center sm:justify-center sm:overflow-y-auto sm:p-6">
              <div className="sticky top-6 w-full">
                <EventImage
                  src={event.image}
                  alt={event.title}
                  width={280}
                  height={280}
                  wrapperClassName="mx-auto overflow-hidden rounded-lg"
                  className="h-auto w-full object-cover"
                  skeletonClassName="aspect-square w-full"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
