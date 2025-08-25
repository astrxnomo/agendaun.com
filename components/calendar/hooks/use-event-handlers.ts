"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/lib/actions/events.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"

import type { Calendars, Events } from "@/types"

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

      try {
        const result = await createEvent(event)

        if (isAppwriteError(result)) {
          toast.error("Error al crear evento", {
            description: result.type,
          })
          return
        }

        onEventsUpdate((prev) => [...prev, result])
        toast.success(`Evento "${result.title}" creado`)
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

      try {
        const result = await updateEvent(updatedEvent.$id, updatedEvent)

        if (isAppwriteError(result)) {
          toast.error("Error al actualizar evento", {
            description: result.type,
          })
          return
        }

        onEventsUpdate((prev) =>
          prev.map((event) =>
            event.$id === updatedEvent.$id ? result : event,
          ),
        )
        toast.success(`Evento "${result.title}" actualizado`)
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
        const result = await deleteEvent(eventId)

        if (isAppwriteError(result)) {
          toast.error("Error al eliminar evento", {
            description: result.type,
          })
          return
        }

        onEventsUpdate((prev) => prev.filter((event) => event.$id !== eventId))
        toast.success("Evento eliminado")
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
