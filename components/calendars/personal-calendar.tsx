"use client"

import { Edit, Eye } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import {
  EtiquettesHeader,
  SetupCalendar,
  useCalendarManager,
  useCalendarPermissions,
} from "@/components/calendar"
import { getEventColor } from "@/components/calendar/utils"
import { Button } from "@/components/ui/button"
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/lib/actions/events.actions"

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
  const [editable, setEditable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const calendarManager = useCalendarManager("personal")
  const permissions = useCalendarPermissions()
  const initializationExecuted = useRef(false)

  // Initialize etiquettes only once
  useEffect(() => {
    if (!initializationExecuted.current && etiquettes.length > 0) {
      calendarManager.setCalendarEtiquettes(etiquettes)
      initializationExecuted.current = true
    }
  }, [calendarManager, etiquettes])

  // Update local events when props change
  useEffect(() => {
    setPersonalEvents(events)
  }, [events])

  // Filter events based on etiquette visibility
  const visibleEvents = useMemo(() => {
    return personalEvents.filter((event) => {
      const color = getEventColor(event, etiquettes)
      return calendarManager.isEtiquetteVisible(color)
    })
  }, [personalEvents, calendarManager, etiquettes])

  const toggleEditMode = () => {
    if (!permissions.canUpdate) {
      toast.error("No tienes permisos para editar este calendario")
      return
    }
    setEditable(!editable)
  }

  const handleEventAdd = async (event: Events) => {
    if (!calendar?.$id) {
      toast.error("Error: No se encontró el calendario personal")
      return
    }

    if (!permissions.canCreate) {
      toast.error("No tienes permisos para crear eventos")
      return
    }

    setIsLoading(true)
    try {
      const eventWithCalendar = {
        ...event,
        calendar_id: calendar.$id,
      }

      const newEvent = await createEvent(eventWithCalendar)
      if (newEvent) {
        setPersonalEvents((prev) => [...prev, newEvent])
        toast.success("Evento creado exitosamente")
      } else {
        toast.error("Error al crear el evento")
      }
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Error al crear el evento")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEventUpdate = async (updatedEvent: Events) => {
    if (!updatedEvent.$id) {
      toast.error("Error: Evento sin ID válido")
      return
    }

    if (!permissions.canUpdate) {
      toast.error("No tienes permisos para actualizar eventos")
      return
    }

    setIsLoading(true)
    try {
      const result = await updateEvent(updatedEvent.$id, updatedEvent)
      if (result) {
        setPersonalEvents((prev) =>
          prev.map((event) =>
            event.$id === updatedEvent.$id ? result : event,
          ),
        )
        toast.success("Evento actualizado exitosamente")
      } else {
        toast.error("Error al actualizar el evento")
      }
    } catch (error) {
      console.error("Error updating event:", error)
      toast.error("Error al actualizar el evento")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEventDelete = async (eventId: string) => {
    if (!permissions.canDelete) {
      toast.error("No tienes permisos para eliminar eventos")
      return
    }

    setIsLoading(true)
    try {
      const success = await deleteEvent(eventId)
      if (success) {
        setPersonalEvents((prev) =>
          prev.filter((event) => event.$id !== eventId),
        )
        toast.success("Evento eliminado exitosamente")
      } else {
        toast.error("Error al eliminar el evento")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Error al eliminar el evento")
    } finally {
      setIsLoading(false)
    }
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
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          variant={editable ? "outline" : "default"}
          onClick={toggleEditMode}
          disabled={isLoading || !permissions.canUpdate}
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
      </div>

      <EtiquettesHeader
        etiquettes={etiquettes}
        isEtiquetteVisible={calendarManager.isEtiquetteVisible}
        toggleEtiquetteVisibility={calendarManager.toggleEtiquetteVisibility}
      />

      <div className="flex-1">
        <SetupCalendar
          events={visibleEvents}
          onEventAdd={
            editable && permissions.canCreate ? handleEventAdd : undefined
          }
          onEventUpdate={
            editable && permissions.canUpdate ? handleEventUpdate : undefined
          }
          onEventDelete={
            editable && permissions.canDelete ? handleEventDelete : undefined
          }
          initialView="week"
          editable={editable}
          permissions={permissions}
          etiquettes={etiquettes}
        />
      </div>
    </div>
  )
}
