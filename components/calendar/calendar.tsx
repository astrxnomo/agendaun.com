"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { EtiquettesHeader, SetupCalendar } from "@/components/calendar"
import {
  CalendarError,
  CalendarSkeleton,
} from "@/components/skeletons/calendar-loading"
import { useAuthContext } from "@/contexts/auth-context"
import { getCalendarBySlug } from "@/lib/actions/calendars.actions"
import { getCalendarEvents } from "@/lib/actions/events.actions"
import { userCanEdit } from "@/lib/actions/users.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"

import { RequireConfig } from "../auth/require-config"

import type { Calendars, Etiquettes, Events } from "@/types"

export default function Calendar({ slug: calendarSlug }: { slug: string }) {
  const { user, profile } = useAuthContext()

  const [calendar, setCalendar] = useState<Calendars | null>(null)
  const [events, setEvents] = useState<Events[]>([])
  const [visibleEtiquettes, setVisibleEtiquettes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const manualRefetch = () => {
    setRefetchTrigger((prev) => prev + 1)
  }

  const toggleEtiquetteVisibility = (etiquetteId: string) => {
    setVisibleEtiquettes((prev) => {
      if (prev.includes(etiquetteId)) {
        return prev.filter((id) => id !== etiquetteId)
      } else {
        return [...prev, etiquetteId]
      }
    })
  }

  const isEtiquetteVisible = (etiquetteId: string | undefined) => {
    if (!etiquetteId) return true
    return visibleEtiquettes.includes(etiquetteId)
  }

  const toggleEditMode = () => setEditMode(!editMode)

  useEffect(() => {
    setCalendar(null)
    setEvents([])
    setError(null)
  }, [calendarSlug])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const slug =
          calendarSlug === "personal"
            ? `${calendarSlug}-${user.$id}`
            : calendarSlug

        const calendarResult = await getCalendarBySlug(slug)
        if (isAppwriteError(calendarResult)) {
          toast.error("Error cargando calendario...", {
            description: calendarResult.type,
          })
          return
        }

        if (!calendarResult) {
          toast.error("Calendario no encontrado")
          return
        }

        setCalendar(calendarResult)

        const permissionsResult = await userCanEdit(calendarResult)
        if (isAppwriteError(permissionsResult)) {
          toast.error("Error cargando permisos...", {
            description: permissionsResult.type,
          })
          setCanEdit(false)
        } else {
          setCanEdit(permissionsResult)
        }

        const eventsResult = await getCalendarEvents(calendarResult, user)
        if (isAppwriteError(eventsResult)) {
          toast.error("Error cargando eventos...", {
            description: eventsResult.type,
          })
        } else {
          setEvents(eventsResult)
        }

        const etiquettes = Array.isArray(calendarResult.etiquettes)
          ? calendarResult.etiquettes
          : []

        const activeEtiquetteIds: string[] = etiquettes
          .filter((etiquette: Etiquettes) => etiquette.isActive)
          .map((etiquette: Etiquettes) => etiquette.$id)
        setVisibleEtiquettes(activeEtiquetteIds)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error al cargar los datos del calendario")
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [user, profile, calendarSlug, refetchTrigger])

  if (isLoading) return <CalendarSkeleton />

  if (error) {
    return <CalendarError error={error} retry={manualRefetch} />
  }

  if (calendar?.requireConfig && !profile?.sede) {
    return <RequireConfig />
  }

  if (!calendar) {
    return (
      <CalendarError error="Calendario no encontrado" retry={manualRefetch} />
    )
  }

  const visibleEvents = events.filter((event) =>
    isEtiquetteVisible(event.etiquette?.$id),
  )

  return (
    <>
      <EtiquettesHeader
        calendar={calendar}
        isEtiquetteVisible={isEtiquetteVisible}
        toggleEtiquetteVisibility={toggleEtiquetteVisibility}
        editMode={editMode}
        canEdit={canEdit}
        onToggleEditMode={toggleEditMode}
        onManualRefetch={manualRefetch}
      />
      <SetupCalendar
        initialView={calendar.defaultView}
        calendar={calendar}
        events={visibleEvents}
        etiquettes={calendar.etiquettes}
        onEventsUpdate={setEvents}
        editable={editMode}
        canEdit={canEdit}
      />
    </>
  )
}
