/**
 * @fileoverview Event Hooks - Event Management
 * @description Hook para manejar operaciones CRUD de eventos del calendario
 * @category Event Hooks
 */

"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

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

      const promise = createEvent(event).then((newEvent) => {
        if (newEvent) {
          onEventsUpdate((prev) => [...prev, newEvent])
          return newEvent
        } else {
          throw new Error("Error al crear el evento")
        }
      })

      try {
        toast.promise(promise, {
          loading: `Creando evento: "${event.title}"...`,
          success: `Evento "${event.title}" creado exitosamente`,
          error: `Error al crear evento: "${event.title}"`,
        })

        await promise
      } finally {
        setIsLoading(false)
      }
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

      setIsLoading(true)

      const promise = updateEvent(updatedEvent.$id, updatedEvent).then(
        (result) => {
          if (result) {
            onEventsUpdate((prev) =>
              prev.map((event) =>
                event.$id === updatedEvent.$id ? result : event,
              ),
            )
            return result
          } else {
            throw new Error("Error al actualizar el evento")
          }
        },
      )

      try {
        toast.promise(promise, {
          loading: `Actualizando evento: "${updatedEvent.title}"...`,
          success: `Evento "${updatedEvent.title}" actualizado exitosamente`,
          error: `Error al actualizar evento: "${updatedEvent.title}"`,
        })

        await promise
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

      const promise = deleteEvent(eventId).then((success) => {
        if (success) {
          onEventsUpdate((prev) =>
            prev.filter((event) => event.$id !== eventId),
          )
          return success
        } else {
          throw new Error("Error al eliminar el evento")
        }
      })

      try {
        toast.promise(promise, {
          loading: "Eliminando evento...",
          success: "Evento eliminado exitosamente",
          error: "Error al eliminar evento",
        })

        await promise
      } finally {
        setIsLoading(false)
      }
    },
    [canEdit, onEventsUpdate],
  )

  return useMemo(
    () => ({
      isLoading,
      handleEventAdd,
      handleEventUpdate,
      handleEventDelete,
    }),
    [isLoading, handleEventAdd, handleEventUpdate, handleEventDelete],
  )
}
