"use client"

import { Edit, Eye } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import {
  EtiquettesHeader,
  EtiquettesManager,
  SetupCalendar,
} from "@/components/calendar"
import { useCalendarPermissions } from "@/components/calendar/hooks/use-calendar-permissions"
import {
  CalendarError,
  CalendarSkeleton,
} from "@/components/skeletons/calendar-loading"
import { Button } from "@/components/ui/button"
import { getEtiquettes } from "@/lib/actions/etiquettes.actions"

import { useCalendar } from "./hooks/use-calendar"

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

  const cal = useCalendar(calendar)
  const permissions = useCalendarPermissions(calendar.$id)

  const refreshEtiquettes = async () => {
    try {
      await getEtiquettes(calendar.$id)

      cal.refetch()
    } catch (error) {
      console.error("Error refreshing etiquettes:", error)
      toast.error("Error al actualizar las etiquetas")
    }
  }

  const toggleEditMode = () => {
    if (!permissions.permissions.canUpdate) {
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
    return <CalendarError error={cal.error} retry={cal.refetch} />
  }

  if (!cal.events && !cal.etiquettes) {
    return (
      <CalendarError
        error="No se pudieron cargar los datos del calendario"
        retry={cal.refetch}
      />
    )
  }

  const visibleEvents = cal.events.filter((event: any) =>
    cal.isEtiquetteVisible(event.etiquette_id),
  )

  return (
    <>
      {(title || (showEditButton && permissions.permissions.canUpdate)) && (
        <div className="flex items-center justify-between border-b p-6">
          <div>
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            <p className="text-muted-foreground text-sm">
              {permissions.permissions.canUpdate
                ? "Tienes permisos para editar este calendario"
                : "Solo puedes ver los eventos de este calendario"}
            </p>
          </div>

          {showEditButton && permissions.permissions.canUpdate && (
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

      <EtiquettesHeader
        etiquettes={cal.etiquettes}
        isEtiquetteVisible={cal.isEtiquetteVisible}
        toggleEtiquetteVisibility={cal.toggleEtiquetteVisibility}
        etiquettesManager={
          editable &&
          permissions.permissions.canUpdate && (
            <EtiquettesManager
              etiquettes={cal.etiquettes}
              calendarId={calendar.$id}
              onUpdate={refreshEtiquettes}
            />
          )
        }
      />

      <div className="flex-1">
        <SetupCalendar
          events={visibleEvents}
          onEventAdd={
            editable && permissions.permissions.canCreate
              ? undefined // Será implementado posteriormente
              : undefined
          }
          onEventUpdate={
            editable && permissions.permissions.canUpdate
              ? undefined // Será implementado posteriormente
              : undefined
          }
          onEventDelete={
            editable && permissions.permissions.canDelete
              ? undefined // Será implementado posteriormente
              : undefined
          }
          initialView={calendar.defaultView}
          editable={editable}
          permissions={permissions.permissions}
          etiquettes={cal.etiquettes}
        />
      </div>
    </>
  )
}
