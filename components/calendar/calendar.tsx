"use client"

import { Edit, Eye } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import {
  EtiquettesHeader,
  EtiquettesManager,
  SetupCalendar,
} from "@/components/calendar"
import {
  CalendarError,
  CalendarSkeleton,
} from "@/components/skeletons/calendar-loading"
import { Button } from "@/components/ui/button"
import { getEtiquettes } from "@/lib/actions/etiquettes.actions"

import { useCalendar } from "./hooks/use-calendar"
import { useEventHandlers } from "./hooks/use-event-handlers"

import type { Calendars } from "@/types"

export default function Calendar({ calendar }: { calendar: Calendars }) {
  const [editMode, setEditMode] = useState(false)

  const {
    events,
    etiquettes,
    isLoading,
    refetch,
    error,
    isEtiquetteVisible,
    toggleEtiquetteVisibility,
    canEdit,
    updateEvents,
  } = useCalendar(calendar)

  // Hook para manejar operaciones CRUD de eventos
  const {
    handleEventAdd,
    handleEventUpdate,
    handleEventDelete,
    isLoading: eventLoading,
  } = useEventHandlers({
    calendar,
    canEdit,
    onEventsUpdate: updateEvents,
  })

  const refreshEtiquettes = async () => {
    try {
      await getEtiquettes(calendar.$id)

      void refetch()
    } catch (error) {
      console.error("Error refreshing etiquettes:", error)
      toast.error("Error al actualizar las etiquetas")
    }
  }

  const toggleEditMode = () => {
    if (!canEdit) {
      toast.error("No tienes permisos para editar este calendario")
      return
    }
    setEditMode(!editMode)
  }

  if (isLoading || eventLoading) {
    return <CalendarSkeleton />
  }

  if (error) {
    return <CalendarError error={error} retry={refetch} />
  }

  if (!events && !etiquettes) {
    return (
      <CalendarError
        error="No se pudieron cargar los datos del calendario"
        retry={refetch}
      />
    )
  }

  const visibleEvents = events.filter((event: any) =>
    isEtiquetteVisible(event.etiquette_id),
  )

  return (
    <>
      <EtiquettesHeader
        etiquettes={etiquettes}
        isEtiquetteVisible={isEtiquetteVisible}
        toggleEtiquetteVisibility={toggleEtiquetteVisibility}
        etiquettesManager={
          editMode && (
            <EtiquettesManager
              etiquettes={etiquettes}
              calendarId={calendar.$id}
              onUpdate={refreshEtiquettes}
            />
          )
        }
        editButton={
          canEdit && (
            <Button
              variant={editMode ? "destructive" : "outline"}
              size="sm"
              onClick={toggleEditMode}
              disabled={!canEdit}
              title={
                canEdit
                  ? editMode
                    ? "Salir del modo edición"
                    : "Entrar en modo edición"
                  : "No tienes permisos para editar este calendario"
              }
            >
              {editMode ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </>
              )}
            </Button>
          )
        }
      />

      <div className="flex-1">
        <SetupCalendar
          events={visibleEvents}
          onEventAdd={canEdit ? handleEventAdd : undefined}
          onEventUpdate={canEdit ? handleEventUpdate : undefined}
          onEventDelete={canEdit ? handleEventDelete : undefined}
          initialView={calendar.defaultView}
          editable={editMode}
          canEdit={canEdit}
          etiquettes={etiquettes}
        />
      </div>
    </>
  )
}
