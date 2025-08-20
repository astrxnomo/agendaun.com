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
import type { CalendarPermissions } from "./use-calendar-permissions"

// ===== TYPES =====

interface UseEventHandlersProps {
  calendar: Calendars
  permissions: CalendarPermissions
  onEventsUpdate: (updater: (prev: Events[]) => Events[]) => void
}

// ===== HOOK =====

/**
 * Hook para manejar operaciones CRUD de eventos
 * @param props - Configuración del hook
 * @param props.calendar - Calendario al que pertenecen los eventos
 * @param props.permissions - Permisos del usuario para el calendario
 * @param props.onEventsUpdate - Callback para actualizar la lista de eventos
 * @returns Handlers para operaciones de eventos y estado de carga
 */
export function useEventHandlers({
  calendar,
  permissions,
  onEventsUpdate,
}: UseEventHandlersProps) {
  const [isLoading, setIsLoading] = useState(false)

  // ===== EVENT HANDLERS =====

  const handleEventAdd = useCallback(
    async (event: Events) => {
      if (!permissions.canCreate) {
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
    [calendar.$id, permissions.canCreate, onEventsUpdate],
  )

  const handleEventUpdate = useCallback(
    async (updatedEvent: Events) => {
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
    },
    [permissions.canUpdate, onEventsUpdate],
  )

  const handleEventDelete = useCallback(
    async (eventId: string) => {
      if (!permissions.canDelete) {
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
    [permissions.canDelete, onEventsUpdate],
  )

  // ===== UTILITY HANDLERS =====

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

  // ===== RETURN MEMOIZED HANDLERS =====

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
