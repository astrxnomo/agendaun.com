"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { EtiquettesHeader, SetupCalendar } from "@/components/calendar"
import { useAuthContext } from "@/contexts/auth-context"
import { getCalendarBySlug } from "@/lib/actions/calendar/calendars.actions"
import { getCalendarEvents } from "@/lib/actions/calendar/events.actions"
import { getProfile } from "@/lib/actions/profiles.actions"
import { canEditCalendar } from "@/lib/actions/users.actions"

import { RequireConfig } from "../auth/require-config"
import { PageHeader } from "../page-header"
import { CalendarError } from "./calendar-error"
import { CalendarSkeleton } from "./calendar-skeleton"

import type {
  CalendarEtiquettes,
  CalendarEvents,
  Calendars,
  Profiles,
} from "@/types"

export default function Calendar({ slug: calendarSlug }: { slug: string }) {
  const { user } = useAuthContext()

  const [calendar, setCalendar] = useState<Calendars | null>(null)
  const [events, setEvents] = useState<CalendarEvents[]>([])
  const [visibleEtiquettes, setVisibleEtiquettes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [refetchTrigger, setRefetchTrigger] = useState(0)
  const [profile, setProfile] = useState<Profiles | null>(null)

  const manualRefetch = () => {
    setRefetchTrigger((prev) => prev + 1)
  }

  const canGetEvents = (calendar: Calendars, profile: Profiles | null) => {
    if (!calendar.requireConfig) return true
    if (!profile) return false

    switch (calendar.slug) {
      case "sede":
        return !!profile.sede
      case "faculty":
        return !!profile.faculty
      case "program":
        return !!profile.program
      default:
        return true
    }
  }

  const getActiveEtiquette = (etiquettes: CalendarEtiquettes[]): string[] => {
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

        if (!calendarResult) {
          toast.error("Calendario no encontrado")
          return
        }

        setCalendar(calendarResult)

        let currentProfile: Profiles | null = null
        if (calendarResult.requireConfig) {
          try {
            const profileResult = await getProfile(user.$id)
            currentProfile = profileResult
            setProfile(profileResult)
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Error cargando perfil"
            toast.error(errorMessage)
            return
          }
        }

        try {
          const canEditResult = await canEditCalendar(calendarResult)
          setCanEdit(canEditResult)
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error cargando permisos"
          toast.error(errorMessage)
          setCanEdit(false)
        }

        if (canGetEvents(calendarResult, currentProfile)) {
          try {
            const eventsResult = await getCalendarEvents(
              calendarResult,
              currentProfile ?? undefined,
            )
            setEvents(eventsResult)
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Error cargando eventos"
            toast.error(errorMessage)
            setEvents([])
          }
        } else {
          setEvents([])
        }

        const etiquettes = Array.isArray(calendarResult.etiquettes)
          ? calendarResult.etiquettes
          : []

        setVisibleEtiquettes(getActiveEtiquette(etiquettes))
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al cargar los datos del calendario"
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [user, calendarSlug, refetchTrigger])

  if (isLoading) return <CalendarSkeleton />

  if (!calendar) {
    return <CalendarError />
  }

  if (calendar.requireConfig && !canGetEvents(calendar, profile)) {
    return <RequireConfig />
  }

  const visibleEvents = events.filter((event) =>
    isEtiquetteVisible(event.etiquette?.$id),
  )

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", href: "/calendars" },
          {
            label: calendar.name ?? "Calendario",
            href: `/calendars/${calendar.slug}`,
            isCurrentPage: true,
          },
        ]}
      />
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
