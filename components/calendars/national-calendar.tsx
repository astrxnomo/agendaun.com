"use client"

import { useEffect, useMemo, useRef } from "react"

import {
  EtiquettesHeader,
  SetupCalendar,
  useCalendarManager,
  useCalendarPermissions,
  type CalendarEvent,
} from "@/components/calendar"
import { type Calendars, type Etiquettes, type Events } from "@/types/db"

interface NationalCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
  events: Events[]
  etiquettes: Etiquettes[]
  calendar: Calendars
}
export default function NationalCalendar({
  userRole = "user",
  events,
  etiquettes,
  calendar,
}: NationalCalendarProps) {
  const managedCalendar = useCalendarManager(calendar.slug)
  const initializationExecuted = useRef(false)

  useEffect(() => {
    if (!initializationExecuted.current && etiquettes.length > 0) {
      managedCalendar.setCalendarEtiquettes(etiquettes)
      initializationExecuted.current = true
    }
  }, [managedCalendar, etiquettes])

  const calendarType = "national"
  const permissions = useCalendarPermissions(calendarType, userRole)

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      return (
        event.etiquettes && calendar.isEtiquetteVisible(event.etiquettes.color)
      )
    })
  }, [events, calendar])

  // Event handlers
  const handleEventAdd = (event: CalendarEvent) => {
    // TODO: Implement event addition logic
    console.log("Adding event:", event)
  }

  const handleEventUpdate = (event: CalendarEvent) => {
    // TODO: Implement event update logic
    console.log("Updating event:", event)
  }

  const handleEventDelete = (eventId: string) => {
    // TODO: Implement event deletion logic
    console.log("Deleting event:", eventId)
  }

  return (
    <>
      <EtiquettesHeader
        etiquettes={etiquettes}
        isEtiquetteVisible={managedCalendar.isEtiquetteVisible}
        toggleEtiquetteVisibility={managedCalendar.toggleEtiquetteVisibility}
      />
      <SetupCalendar
        events={visibleEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        initialView={calendar.defaultView}
        editable={permissions.canEdit}
        permissions={permissions}
        customEtiquettes={etiquettes}
      />
    </>
  )
}
