"use client"

import { useEffect, useMemo, useRef } from "react"

import {
  EtiquettesHeader,
  SetupCalendar,
  useCalendarManager,
  useCalendarPermissions,
} from "@/components/calendar"
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/lib/actions/events.actions"

import type { Etiquettes, Events } from "@/types"

interface NationalCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
  events?: Events[]
  etiquettes?: Etiquettes[]
}

export default function NationalCalendar({
  userRole = "user",
  events = [],
  etiquettes = [],
}: NationalCalendarProps) {
  const calendar = useCalendarManager("national")
  const initializationExecuted = useRef(false)

  // Initialize etiquettes only once
  useEffect(() => {
    if (!initializationExecuted.current) {
      calendar.setCalendarEtiquettes(etiquettes)
      initializationExecuted.current = true
    }
  }, [calendar, etiquettes])

  // Calculate permissions based on user role
  const calendarType = "national"
  const permissions = useCalendarPermissions(calendarType, userRole)

  // Filter events based on etiquette visibility
  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      // Para eventos de la base de datos, buscar la etiqueta por etiquette_id
      const etiquette = etiquettes.find((e) => e.$id === event.etiquette_id)
      const color = etiquette?.color || "gray"
      return calendar.isEtiquetteVisible(color)
    })
  }, [events, etiquettes, calendar])

  // Event handlers
  const handleEventAdd = async (event: Events) => {
    try {
      await createEvent(event)
      console.log("Event added successfully")
    } catch (error) {
      console.error("Error adding event:", error)
    }
  }

  const handleEventUpdate = async (event: Events) => {
    try {
      await updateEvent(event.$id, event)
      console.log("Event updated successfully")
    } catch (error) {
      console.error("Error updating event:", error)
    }
  }

  const handleEventDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId)
      console.log("Event deleted successfully")
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  return (
    <>
      <EtiquettesHeader
        etiquettes={etiquettes}
        isEtiquetteVisible={calendar.isEtiquetteVisible}
        toggleEtiquetteVisibility={calendar.toggleEtiquetteVisibility}
      />
      <SetupCalendar
        events={visibleEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView="month"
        editable={permissions.canEdit}
        permissions={permissions}
        etiquettes={etiquettes}
      />
    </>
  )
}
