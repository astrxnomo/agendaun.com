"use client"

import { useState } from "react"
import { toast } from "sonner"

import { getEtiquettes } from "@/lib/actions/etiquettes.actions"
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/lib/actions/events.actions"

import type { Calendars, Events } from "@/types"
import type { CalendarPermissions } from "./use-calendar-permissions"

interface UseEventHandlersProps {
  calendar: Calendars
  permissions: CalendarPermissions
  onEventsUpdate: (updater: (prev: Events[]) => Events[]) => void
}

export function useEventHandlers({
  calendar,
  permissions,
  onEventsUpdate,
}: UseEventHandlersProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEventAdd = async (event: Events) => {
    if (!permissions.canCreate) {
      toast.error("No tienes permisos para crear eventos")
      return
    }

    setIsLoading(true)
    try {
      const eventWithCalendar = { ...event, calendarId: calendar.$id }
      const newEvent = await createEvent(eventWithCalendar)

      if (newEvent) {
        onEventsUpdate((prev) => [...prev, newEvent])
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
        onEventsUpdate((prev) =>
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
        onEventsUpdate((prev) => prev.filter((event) => event.$id !== eventId))
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

  const refreshEtiquettes = async () => {
    try {
      const updatedEtiquettes = await getEtiquettes(calendar.$id)
      return updatedEtiquettes
    } catch (error) {
      console.error("Error refreshing etiquettes:", error)
      toast.error("Error al actualizar las etiquetas")
      return []
    }
  }

  return {
    isLoading,
    handleEventAdd,
    handleEventUpdate,
    handleEventDelete,
    refreshEtiquettes,
  }
}
