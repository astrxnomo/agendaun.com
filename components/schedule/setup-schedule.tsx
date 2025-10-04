"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import {
  createScheduleEvent,
  deleteScheduleEvent,
  updateScheduleEvent,
} from "@/lib/actions/schedule/events.actions"

import { DefaultEventDuration } from "./constants"
import { ScheduleEventDialog } from "./event-dialog"
import { ScheduleEventViewDialog } from "./event-view-dialog"
import { ScheduleView } from "./schedule-view"

import type { ScheduleEvents, Schedules } from "@/types"

export interface SetupScheduleProps {
  schedule: Schedules
  events: ScheduleEvents[]
  onEventsUpdate: (
    updater: (prev: ScheduleEvents[]) => ScheduleEvents[],
  ) => void
  editable?: boolean
  canEdit?: boolean
}

export function SetupSchedule({
  schedule,
  events,
  onEventsUpdate,
  editable = true,
  canEdit = false,
}: SetupScheduleProps) {
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvents | null>(
    null,
  )
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const handleEventSelect = useCallback(
    (event: ScheduleEvents) => {
      setSelectedEvent(event)
      if (editable && canEdit) {
        setIsEventDialogOpen(true)
      } else {
        setIsViewDialogOpen(true)
      }
    },
    [editable, canEdit],
  )

  const handleEventCreate = useCallback(
    (startTime: Date) => {
      if (!editable || !canEdit) return

      const endTime = new Date(
        startTime.getTime() + DefaultEventDuration * 60 * 1000,
      )
      const newEvent: Partial<ScheduleEvents> = {
        title: "",
        description: null,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        location: null,
        schedule: schedule,
      }
      setSelectedEvent(newEvent as ScheduleEvents)
      setIsEventDialogOpen(true)
    },
    [editable, canEdit, schedule],
  )

  const handleEventSave = async (event: ScheduleEvents) => {
    if (event.$id) {
      // Actualizar evento existente
      const promise = updateScheduleEvent(event).then((result) => {
        onEventsUpdate((prev) =>
          prev.map((e) => (e.$id === event.$id ? result : e)),
        )
        return result
      })

      toast.promise(promise, {
        loading: "Actualizando evento...",
        success: (result) => `Evento "${result.title}" actualizado`,
        error: (err: Error) => err.message,
      })

      try {
        await promise
        setIsEventDialogOpen(false)
        setSelectedEvent(null)
      } catch {
        // El diálogo permanece abierto si hay error
      }
    } else {
      // Crear evento nuevo
      const promise = createScheduleEvent(event).then((result) => {
        onEventsUpdate((prev) => [...prev, result])
        return result
      })

      toast.promise(promise, {
        loading: "Creando evento...",
        success: (result) => `Evento "${result.title}" creado`,
        error: (err: Error) => err.message,
      })

      try {
        await promise
        setIsEventDialogOpen(false)
        setSelectedEvent(null)
      } catch {
        // El diálogo permanece abierto si hay error
      }
    }
  }

  const handleEventDelete = async (eventId: string) => {
    const promise = deleteScheduleEvent(eventId).then(() => {
      onEventsUpdate((prev) => prev.filter((event) => event.$id !== eventId))
      return true
    })

    toast.promise(promise, {
      loading: "Eliminando evento...",
      success: "Evento eliminado",
      error: (err: Error) => err.message,
    })

    try {
      await promise
      setIsEventDialogOpen(false)
      setSelectedEvent(null)
    } catch {
      // El diálogo permanece abierto si hay error
    }
  }

  return (
    <>
      <div
        className="flex flex-1 flex-col overflow-auto"
        style={
          {
            "--week-cells-height": "72px",
          } as React.CSSProperties
        }
      >
        <div className="flex flex-1 flex-col">
          <ScheduleView
            events={events}
            onEventSelect={handleEventSelect}
            onEventCreate={handleEventCreate}
            editable={editable}
            canEdit={canEdit}
          />
        </div>
      </div>

      {selectedEvent && (
        <>
          <ScheduleEventDialog
            schedule={schedule}
            event={selectedEvent}
            isOpen={isEventDialogOpen}
            onClose={() => {
              setIsEventDialogOpen(false)
              setSelectedEvent(null)
            }}
            onSave={handleEventSave}
            onDelete={handleEventDelete}
          />
          <ScheduleEventViewDialog
            event={selectedEvent}
            isOpen={isViewDialogOpen}
            onClose={() => {
              setIsViewDialogOpen(false)
              setSelectedEvent(null)
            }}
          />
        </>
      )}
    </>
  )
}
