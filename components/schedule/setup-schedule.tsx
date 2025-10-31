"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { deleteEvent } from "@/lib/actions/schedule/events"

import { DefaultEventDuration } from "./constants"
import { ScheduleEventDialog } from "./event-dialog"
import { ScheduleEventViewDialog } from "./event-view-dialog"
import { ScheduleView } from "./schedule-view"

import type { ScheduleEvents, Schedules } from "@/lib/data/types"

export interface SetupScheduleProps {
  schedule: Schedules
  events: ScheduleEvents[]
  onEventsUpdate: (
    updater: (prev: ScheduleEvents[]) => ScheduleEvents[],
  ) => void
  editable?: boolean
  canEdit?: boolean
  newEventTriggerRef?: React.MutableRefObject<(() => void) | null>
}

export function SetupSchedule({
  schedule,
  events,
  onEventsUpdate,
  editable = true,
  canEdit = false,
  newEventTriggerRef,
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

      const day = startTime.getDay()
      const dayOfWeek = day === 0 ? 7 : day

      const endTime = new Date(
        startTime.getTime() + DefaultEventDuration * 60 * 1000,
      )

      const newEvent: Partial<ScheduleEvents> = {
        title: "",
        description: null,
        days_of_week: [dayOfWeek],
        start_hour: startTime.getHours(),
        start_minute: startTime.getMinutes(),
        end_hour: endTime.getHours(),
        end_minute: endTime.getMinutes(),
        location: null,
        schedule: schedule,
      }
      setSelectedEvent(newEvent as ScheduleEvents)
      setIsEventDialogOpen(true)
    },
    [editable, canEdit, schedule],
  )

  const handleEventSave = useCallback(
    (savedEvent: ScheduleEvents) => {
      // Verificar si es actualización de evento existente
      const isExistingEvent = selectedEvent?.$id && savedEvent.$id

      if (isExistingEvent) {
        // Actualizar evento existente
        onEventsUpdate((prev) =>
          prev.map((e) => (e.$id === savedEvent.$id ? savedEvent : e)),
        )
      } else {
        // Crear nuevo evento - siempre agregar
        onEventsUpdate((prev) => [...prev, savedEvent])
      }

      // Cerrar dialog y limpiar estado
      setIsEventDialogOpen(false)
      setSelectedEvent(null)
    },
    [selectedEvent, onEventsUpdate],
  )

  const handleEventDelete = async (eventId: string) => {
    const deletePromise = deleteEvent(eventId)

    toast.promise(deletePromise, {
      loading: "Eliminando evento...",
      success: (result) => {
        if (result.success) {
          onEventsUpdate((prev) =>
            prev.filter((event) => event.$id !== eventId),
          )
          setIsEventDialogOpen(false)
          setSelectedEvent(null)
          return result.message
        }
        throw new Error(result.message)
      },
      error: (err) => err.message || "Error al eliminar el evento",
    })
  }

  // Exponer handleEventCreate a través del ref para el botón del header
  useEffect(() => {
    if (newEventTriggerRef) {
      newEventTriggerRef.current = () => {
        const defaultDate = new Date()
        defaultDate.setHours(9, 0, 0, 0)
        handleEventCreate(defaultDate)
      }
    }
  }, [handleEventCreate, newEventTriggerRef])

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
            schedule={schedule}
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
