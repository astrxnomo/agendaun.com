"use client"

import { Edit, Eye } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  EtiquettesHeader,
  EtiquettesManager,
  SetupCalendar,
  useCalendarManager,
  useCalendarPermissions,
} from "@/components/calendar"
import { useEventHandlers } from "@/components/calendar/hooks/use-event-handlers"
import { getEventColor } from "@/components/calendar/utils"
import { Button } from "@/components/ui/button"
import { getEtiquettes } from "@/lib/actions/etiquettes.actions"

import { PageHeader } from "../page-header"

import type { Calendars, Etiquettes, Events } from "@/types"

interface PersonalCalendarProps {
  events?: Events[]
  etiquettes?: Etiquettes[]
  calendar?: Calendars
}

export default function PersonalCalendar({
  events = [],
  etiquettes = [],
  calendar,
}: PersonalCalendarProps) {
  const [personalEvents, setPersonalEvents] = useState<Events[]>(events)
  const [personalEtiquettes, setPersonalEtiquettes] =
    useState<Etiquettes[]>(etiquettes)
  const [editable, setEditable] = useState(false)

  const calendarManager = useCalendarManager("personal")
  const { permissions } = useCalendarPermissions(calendar?.$id)

  const eventHandlers = useEventHandlers({
    calendar: calendar!,
    permissions,
    onEventsUpdate: setPersonalEvents,
  })

  useEffect(() => {
    if (personalEtiquettes.length > 0) {
      calendarManager.setCalendarEtiquettes(personalEtiquettes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalEtiquettes, calendarManager.setCalendarEtiquettes])

  // Sincronizar con props
  useEffect(() => setPersonalEvents(events), [events])
  useEffect(() => setPersonalEtiquettes(etiquettes), [etiquettes])

  const refreshEtiquettes = async () => {
    if (!calendar?.$id) return

    try {
      const updatedEtiquettes = await getEtiquettes(calendar.$id)
      setPersonalEtiquettes(updatedEtiquettes)
      calendarManager.setCalendarEtiquettes(updatedEtiquettes)
    } catch (error) {
      console.error("Error refreshing etiquettes:", error)
      toast.error("Error al actualizar las etiquetas")
    }
  }

  const visibleEvents = useMemo(() => {
    return personalEvents.filter((event) => {
      const color = getEventColor(event, personalEtiquettes)
      return calendarManager.isEtiquetteVisible(color)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalEvents, personalEtiquettes, calendarManager.isEtiquetteVisible])

  const toggleEditMode = () => {
    if (!permissions.canUpdate) {
      toast.error("No tienes permisos para editar este calendario")
      return
    }
    setEditable(!editable)
  }

  if (!calendar) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">
          No se encontró el calendario personal. Por favor, inicia sesión
          nuevamente.
        </p>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Mi Calendario", isCurrentPage: true },
        ]}
        action={
          permissions.canUpdate ? (
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
          ) : null
        }
      />

      <EtiquettesHeader
        etiquettes={personalEtiquettes}
        isEtiquetteVisible={calendarManager.isEtiquetteVisible}
        toggleEtiquetteVisibility={calendarManager.toggleEtiquetteVisibility}
        etiquettesManager={
          editable && (
            <EtiquettesManager
              etiquettes={personalEtiquettes}
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
          initialView={calendar.defaultView}
          editable={editable}
          permissions={permissions}
          etiquettes={personalEtiquettes}
        />
      </div>
    </>
  )
}
