"use client"

import { CalendarSync } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import {
  EditModeToggle,
  EtiquettesHeader,
  EtiquettesManager,
  SetupCalendar,
} from "@/components/calendar"
import {
  CalendarError,
  CalendarSkeleton,
} from "@/components/skeletons/calendar-loading"

import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { useCalendar } from "./hooks/use-calendar"
import { useEventHandlers } from "./hooks/use-event-handlers"
export default function Calendar({ calendarSlug }: { calendarSlug: string }) {
  const [editMode, setEditMode] = useState(false)

  const {
    calendar,
    events,
    etiquettes,
    isLoading,
    refetch,
    error,
    isEtiquetteVisible,
    toggleEtiquetteVisibility,
    canEdit,
    updateEvents,
  } = useCalendar(calendarSlug)

  const { handleEventAdd, handleEventUpdate, handleEventDelete } =
    useEventHandlers({
      calendar: calendar!,
      canEdit,
      onEventsUpdate: updateEvents,
    })

  const toggleEditMode = () => {
    if (!canEdit) {
      toast.error("No tienes permisos para editar este calendario")
      return
    }
    setEditMode(!editMode)
  }

  if (isLoading) {
    return <CalendarSkeleton />
  }
  if (error) {
    return <CalendarError error={error} retry={refetch} />
  }

  if (!calendar) {
    return <CalendarError error="Calendario no encontrado" retry={refetch} />
  }

  if (!events && !etiquettes) {
    return (
      <CalendarError
        error="No se pudieron cargar los datos del calendario"
        retry={refetch}
      />
    )
  }

  const visibleEvents = Array.isArray(events)
    ? events.filter((event: any) => isEtiquetteVisible(event.etiquette?.$id))
    : []

  const safeEtiquettes = Array.isArray(etiquettes) ? etiquettes : []

  return (
    <>
      <EtiquettesHeader
        etiquettes={safeEtiquettes}
        isEtiquetteVisible={isEtiquetteVisible}
        toggleEtiquetteVisibility={toggleEtiquetteVisibility}
        etiquettesManager={
          editMode &&
          calendar && (
            <EtiquettesManager
              etiquettes={safeEtiquettes}
              calendar={calendar}
              onUpdate={refetch}
            />
          )
        }
        editButton={
          canEdit && (
            <EditModeToggle
              checked={editMode}
              onCheckedChange={toggleEditMode}
              disabled={!canEdit}
            />
          )
        }
        syncButton={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={refetch}>
                <CalendarSync />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Actualizar calendario</p>
            </TooltipContent>
          </Tooltip>
        }
      />

      <div className="flex-1">
        {calendar && (
          <SetupCalendar
            calendar={calendar}
            events={visibleEvents}
            etiquettes={etiquettes}
            editable={editMode}
            canEdit={canEdit}
            onEventAdd={canEdit ? handleEventAdd : undefined}
            onEventUpdate={canEdit ? handleEventUpdate : undefined}
            onEventDelete={canEdit ? handleEventDelete : undefined}
            initialView={calendar.defaultView}
          />
        )}
      </div>
    </>
  )
}
