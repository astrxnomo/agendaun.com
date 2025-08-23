/**
 * @fileoverview Event Hooks - Event Management
 * @description Hook para manejar operaciones CRUD de eventos del calendario
 * @category Event Hooks
 */

"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

import { getEtiquettes } from "@/lib/actions/etiquettes.actions"
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/lib/actions/events.actions"

import type { Calendars, Events } from "@/types"

// ===== TYPES =====

interface UseEventHandlersProps {
  calendar: Calendars
  canEdit: boolean
  onEventsUpdate: (updater: (prev: Events[]) => Events[]) => void
}

export function useEventHandlers({
  calendar,
  canEdit,
  onEventsUpdate,
}: UseEventHandlersProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEventAdd = useCallback(
    async (event: Events) => {
      if (!canEdit) {
        toast.error("No tienes permisos para crear eventos")
        return
      }

      setIsLoading(true)
      try {
        const eventWithCalendar = { ...event, calendar_id: calendar.$id }
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
    },
    [calendar.$id, canEdit, onEventsUpdate],
  )

  const handleEventUpdate = useCallback(
    async (updatedEvent: Events) => {
      if (!updatedEvent.$id) {
        toast.error("Error: Evento sin ID válido")
        return
      }

      if (!canEdit) {
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
    },
    [canEdit, onEventsUpdate],
  )

  const handleEventDelete = useCallback(
    async (eventId: string) => {
      if (!canEdit) {
        toast.error("No tienes permisos para eliminar eventos")
        return
      }

      setIsLoading(true)
      try {
        const success = await deleteEvent(eventId)
        if (success) {
          onEventsUpdate((prev) =>
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
    },
    [canEdit, onEventsUpdate],
  )

  const refreshEtiquettes = useCallback(async () => {
    try {
      const updatedEtiquettes = await getEtiquettes(calendar.$id)
      return updatedEtiquettes
    } catch (error) {
      console.error("Error refreshing etiquettes:", error)
      toast.error("Error al actualizar las etiquetas")
      return []
    }
  }, [calendar.$id])

  return useMemo(
    () => ({
      isLoading,
      handleEventAdd,
      handleEventUpdate,
      handleEventDelete,
      refreshEtiquettes,
    }),
    [
      isLoading,
      handleEventAdd,
      handleEventUpdate,
      handleEventDelete,
      refreshEtiquettes,
    ],
  )
}
