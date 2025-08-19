"use client"

import { Edit, Eye } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  EtiquettesHeader,
  EtiquettesManager,
  SetupCalendar,
  useCalendarManager,
} from "@/components/calendar"
import { useNationalCalendarPermissions } from "@/components/calendar/hooks/use-calendar-permissions"
import { useEventHandlers } from "@/components/calendar/hooks/use-event-handlers"
import { getEventColor } from "@/components/calendar/utils"
import { Button } from "@/components/ui/button"
import { getEtiquettes } from "@/lib/actions/etiquettes.actions"

import type { Calendars, Etiquettes, Events } from "@/types"

interface NationalCalendarProps {
  calendar: Calendars
  events?: Events[]
  etiquettes?: Etiquettes[]
}

export default function NationalCalendar({
  calendar,
  events = [],
  etiquettes = [],
}: NationalCalendarProps) {
  const [nationalEvents, setNationalEvents] = useState<Events[]>(events)
  const [nationalEtiquettes, setNationalEtiquettes] =
    useState<Etiquettes[]>(etiquettes)
  const [editable, setEditable] = useState(false)

  const calendarManager = useCalendarManager("national")
  const { permissions, isLoading: permissionsLoading } =
    useNationalCalendarPermissions(calendar.$id)

  // Initialize event handlers hook
  const eventHandlers = useEventHandlers({
    calendar,
    permissions,
    onEventsUpdate: setNationalEvents,
  })

  // Inicializar etiquetas una sola vez
  useEffect(() => {
    if (nationalEtiquettes.length > 0) {
      calendarManager.setCalendarEtiquettes(nationalEtiquettes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nationalEtiquettes, calendarManager.setCalendarEtiquettes])

  // Sincronizar con props
  useEffect(() => setNationalEvents(events), [events])
  useEffect(() => setNationalEtiquettes(etiquettes), [etiquettes])

  const refreshEtiquettes = async () => {
    try {
      const updatedEtiquettes = await getEtiquettes(calendar.$id)
      setNationalEtiquettes(updatedEtiquettes)
      calendarManager.setCalendarEtiquettes(updatedEtiquettes)
    } catch (error) {
      console.error("Error refreshing etiquettes:", error)
      toast.error("Error al actualizar las etiquetas")
    }
  }

  const visibleEvents = useMemo(() => {
    return nationalEvents.filter((event) => {
      const color = getEventColor(event, nationalEtiquettes)
      return calendarManager.isEtiquetteVisible(color)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nationalEvents, nationalEtiquettes, calendarManager.isEtiquetteVisible])

  const toggleEditMode = () => {
    if (!permissions.canUpdate) {
      toast.error("No tienes permisos para editar este calendario")
      return
    }
    setEditable(!editable)
  }

  if (permissionsLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Cargando permisos...</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h2 className="text-xl font-semibold">Gestión del Calendario</h2>
          <p className="text-muted-foreground text-sm">
            {permissions.canUpdate
              ? "Tienes permisos para editar este calendario"
              : "Solo puedes ver los eventos de este calendario"}
          </p>
        </div>

        {permissions.canUpdate && (
          <Button
            variant={editable ? "outline" : "default"}
            onClick={toggleEditMode}
            disabled={eventHandlers.isLoading}
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

      <EtiquettesHeader
        etiquettes={nationalEtiquettes}
        isEtiquetteVisible={calendarManager.isEtiquetteVisible}
        toggleEtiquetteVisibility={calendarManager.toggleEtiquetteVisibility}
        etiquettesManager={
          editable &&
          permissions.canUpdate && (
            <EtiquettesManager
              etiquettes={nationalEtiquettes}
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
            editable && permissions.canCreate
              ? eventHandlers.handleEventAdd
              : undefined
          }
          onEventUpdate={
            editable && permissions.canUpdate
              ? eventHandlers.handleEventUpdate
              : undefined
          }
          onEventDelete={
            editable && permissions.canDelete
              ? eventHandlers.handleEventDelete
              : undefined
          }
          initialView="month"
          editable={editable}
          permissions={permissions}
          etiquettes={nationalEtiquettes}
        />
      </div>
    </>
  )
}
