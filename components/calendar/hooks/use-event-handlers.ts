"use client"

import { useCallback, useMemo } from "react"
import { toast } from "sonner"

import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/lib/actions/events.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"

import type { Events } from "@/types"

interface UseEventHandlersProps {
  canEdit: boolean
  onEventsUpdate: (updater: (prev: Events[]) => Events[]) => void
}

export function useEventHandlers({
  canEdit,
  onEventsUpdate,
}: UseEventHandlersProps) {
  const handleEventAdd = useCallback(
    async (event: Events) => {
      if (!canEdit) {
        toast.error("No tienes permisos para crear eventos")
        return
      }

      const promise = createEvent(event).then((result) => {
        if (isAppwriteError(result)) {
          throw new Error(result.message || "Error al crear evento")
        }

        onEventsUpdate((prev) => [...prev, result])
        return result
      })

      toast.promise(promise, {
        loading: "Creando evento...",
        success: (result) => `Evento "${result.title}" creado`,
        error: (err: Error) => err.message || "Error al crear evento",
      })
    },
    [canEdit, onEventsUpdate],
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

      const promise = updateEvent(updatedEvent.$id, updatedEvent).then(
        (result) => {
          if (isAppwriteError(result)) {
            throw new Error(result.message || "Error al actualizar evento")
          }

          onEventsUpdate((prev) =>
            prev.map((event) =>
              event.$id === updatedEvent.$id ? result : event,
            ),
          )
          return result
        },
      )

      toast.promise(promise, {
        loading: "Actualizando evento...",
        success: (result) => `Evento "${result.title}" actualizado`,
        error: (err: Error) => err.message || "Error al actualizar evento",
      })
    },
    [canEdit, onEventsUpdate],
  )

  const handleEventDelete = useCallback(
    async (eventId: string) => {
      if (!canEdit) {
        toast.error("No tienes permisos para eliminar eventos")
        return
      }

      const promise = deleteEvent(eventId).then((result) => {
        if (isAppwriteError(result)) {
          throw new Error(result.message || "Error al eliminar evento")
        }

        onEventsUpdate((prev) => prev.filter((event) => event.$id !== eventId))
        return result
      })

      toast.promise(promise, {
        loading: "Eliminando evento...",
        success: "Evento eliminado",
        error: (err: Error) => err.message || "Error al eliminar evento",
      })
    },
    [canEdit, onEventsUpdate],
  )

  return useMemo(
    () => ({
      handleEventAdd,
      handleEventUpdate,
      handleEventDelete,
    }),
    [handleEventAdd, handleEventUpdate, handleEventDelete],
  )
}
