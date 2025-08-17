"use client"

import { useEffect, useMemo, useRef } from "react"

import {
  EtiquettesHeader,
  SetupCalendar,
  useCalendarManager,
  useCalendarPermissions,
  type CalendarEvent,
  type Etiquette,
} from "@/components/calendar"

interface NationalCalendarProps {
  userRole?: "admin" | "editor" | "moderator" | "user"
  events?: CalendarEvent[]
  etiquettes?: Etiquette[]
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
  }, [calendar])

  // Calculate permissions based on user role
  const calendarType = "national"
  const permissions = useCalendarPermissions(calendarType, userRole)

  // Filter events based on etiquette visibility (national calendar doesn't use academic filters)
  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      // Apply etiquette visibility
      return calendar.isEtiquetteVisible(event.color)
    })
  }, [calendar])

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
        customEtiquettes={etiquettes} // ← Pasar etiquetas específicas del calendario nacional
      />
    </>
  )
}
