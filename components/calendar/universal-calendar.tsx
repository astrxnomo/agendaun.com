"use client"

import { Edit, Eye } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import {
  EtiquettesHeader,
  EtiquettesManager,
  SetupCalendar,
} from "@/components/calendar"
import { useCalendar } from "@/components/calendar/hooks/use-calendar"
import {
  CalendarError,
  CalendarSkeleton,
} from "@/components/skeletons/calendar-loading"
import { Button } from "@/components/ui/button"
import { getEtiquettes } from "@/lib/actions/etiquettes.actions"

import type { Calendars } from "@/types"

interface UniversalCalendarProps {
  calendar: Calendars
  showEditButton?: boolean
  title?: string
}

export default function UniversalCalendar({
  calendar,
  showEditButton = true,
  title,
}: UniversalCalendarProps) {
  const [editable, setEditable] = useState(false)

  const cal = useCalendar()

  const refreshEtiquettes = async () => {
    try {
      const updatedEtiquettes = await getEtiquettes(calendar.$id)
      cal.actions.setCalendarEtiquettes(updatedEtiquettes)
      cal.actions.refetch()
    } catch (error) {
      console.error("Error refreshing etiquettes:", error)
      toast.error("Error al actualizar las etiquetas")
    }
  }

  const toggleEditMode = () => {
    if (!cal.permissions.canUpdate) {
      toast.error("No tienes permisos para editar este calendario")
      return
    }
    setEditable(!editable)
  }

  // Estados de carga y error
  if (cal.isLoading) {
    return <CalendarSkeleton />
  }

  if (cal.error) {
    return <CalendarError error={cal.error} retry={cal.actions.refetch} />
  }

  if (!cal.events && !cal.etiquettes) {
    return (
      <CalendarError
        error="No se pudieron cargar los datos del calendario"
        retry={cal.actions.refetch}
      />
    )
  }

  return (
    <>
      {/* Header con título y botón de edición (solo si tiene permisos) */}
      {(title || (showEditButton && cal.permissions.canUpdate)) && (
        <div className="flex items-center justify-between border-b p-6">
          <div>
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            <p className="text-muted-foreground text-sm">
              {cal.permissions.canUpdate
                ? "Tienes permisos para editar este calendario"
                : "Solo puedes ver los eventos de este calendario"}
            </p>
          </div>

          {showEditButton && cal.permissions.canUpdate && (
            <Button
              variant={editable ? "outline" : "default"}
              onClick={toggleEditMode}
              className="flex items-center gap-2"
              title={
                editable
                  ? "Cambiar a modo solo lectura - No podrás editar eventos"
                  : "Habilitar edición - Podrás crear, editar y eliminar eventos"
              }
            >
              {editable ? (
                <>
                  <Eye />
                  Lectura
                </>
              ) : (
                <>
                  <Edit />
                  Editar
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Header de etiquetas */}
      <EtiquettesHeader
        etiquettes={cal.etiquettes}
        isEtiquetteVisible={cal.actions.isEtiquetteVisible}
        toggleEtiquetteVisibility={cal.actions.toggleEtiquetteVisibility}
        etiquettesManager={
          editable &&
          cal.permissions.canUpdate && (
            <EtiquettesManager
              etiquettes={cal.etiquettes}
              calendarId={calendar.$id}
              onUpdate={refreshEtiquettes}
            />
          )
        }
      />

      {/* Calendario principal */}
      <div className="flex-1">
        <SetupCalendar
          events={cal.visibleEvents}
          onEventAdd={
            editable && cal.permissions.canCreate
              ? cal.actions.addEvent
              : undefined
          }
          onEventUpdate={
            editable && cal.permissions.canUpdate
              ? cal.actions.updateEvent
              : undefined
          }
          onEventDelete={
            editable && cal.permissions.canDelete
              ? cal.actions.deleteEvent
              : undefined
          }
          initialView="month"
          editable={editable}
          permissions={cal.permissions}
          etiquettes={cal.etiquettes}
        />
      </div>
    </>
  )
}
