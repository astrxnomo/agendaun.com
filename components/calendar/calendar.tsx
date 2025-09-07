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
import { getProfile } from "@/lib/actions/profiles.actions"
import { userCanEdit } from "@/lib/actions/users.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"

import { RequireConfig } from "../auth/require-config"

import type { Calendars, Etiquettes, Events, Profiles } from "@/types"

export default function Calendar({ slug: calendarSlug }: { slug: string }) {
  const { user } = useAuthContext()

  const [calendar, setCalendar] = useState<Calendars | null>(null)
  const [events, setEvents] = useState<Events[]>([])
  const [visibleEtiquettes, setVisibleEtiquettes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [refetchTrigger, setRefetchTrigger] = useState(0)
  const [profile, setProfile] = useState<Profiles | null>(null)

  const manualRefetch = () => {
    setRefetchTrigger((prev) => prev + 1)
  }

  // Helper: Validar si el profile es suficiente para el tipo de calendario
  const shouldFetchEvents = (calendar: Calendars, profile: Profiles | null) => {
    if (!calendar.requireConfig) return true
    if (!profile) return false

    switch (calendar.slug) {
      case "sede-calendar":
        return !!profile.sede
      case "faculty-calendar":
        return !!profile.faculty
      case "program-calendar":
        return !!profile.program
      default:
        return true
    }
  }

  const getActiveEtiquette = (etiquettes: Etiquettes[]): string[] => {
    return etiquettes
      .filter((etiquette) => etiquette.isActive)
      .map((etiquette) => etiquette.$id)
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
    setProfile(null)
  }, [calendarSlug])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setIsLoading(true)

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

        let currentProfile: Profiles | null = null
        if (calendarResult.requireConfig) {
          const profileResult = await getProfile(user.$id)
          if (isAppwriteError(profileResult)) {
            toast.error("Error cargando perfil...", {
              description: profileResult.type,
            })
            return
          }
          currentProfile = profileResult
          setProfile(profileResult)
        }

        const permissionsResult = await userCanEdit(calendarResult)
        if (isAppwriteError(permissionsResult)) {
          toast.error("Error cargando permisos...", {
            description: permissionsResult.type,
          })
          setCanEdit(false)
        } else {
          setCanEdit(permissionsResult)
        }

        if (shouldFetchEvents(calendarResult, currentProfile)) {
          const eventsResult = await getCalendarEvents(
            calendarResult,
            currentProfile ?? undefined,
          )
          if (isAppwriteError(eventsResult)) {
            toast.error("Error cargando eventos...", {
              description: eventsResult.type,
            })
          } else {
            setEvents(eventsResult)
          }
        } else {
          setEvents([])
        }

        const etiquettes = Array.isArray(calendarResult.etiquettes)
          ? calendarResult.etiquettes
          : []

        setVisibleEtiquettes(getActiveEtiquette(etiquettes))
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error al cargar los datos del calendario")
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [user, calendarSlug, refetchTrigger])

  if (isLoading) return <CalendarSkeleton />

  if (!calendar) {
    return (
      <CalendarError error="Calendario no encontrado" retry={manualRefetch} />
    )
  }

  if (calendar.requireConfig && !shouldFetchEvents(calendar, profile)) {
    return <RequireConfig />
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
