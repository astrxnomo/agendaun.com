"use client"

import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useAuthContext } from "@/contexts/auth-context"
import { canEditCalendar } from "@/lib/actions/users"
import { getCalendarBySlug } from "@/lib/data/calendars/getBySlug"
import { getEvents } from "@/lib/data/calendars/getEvents"
import { getProfile } from "@/lib/data/profiles/getProfile"

import { ConfigDialog } from "@/components/auth/config-dialog"

import { PageHeader } from "@/components/layout/page-header"
import { StatusMessage } from "@/components/status-message"
import type {
  CalendarEtiquettes,
  CalendarEvents,
  Calendars,
  Profiles,
} from "@/lib/data/types"
import { Button } from "react-aria-components"
import { EtiquettesHeader } from "./etiquettes/etiquettes-header"
import { CalendarNotFound } from "./not-found"
import { SetupCalendar } from "./setup-calendar"
import { CalendarSkeleton } from "./skeleton"

export default function Calendar({ slug: calendarSlug }: { slug: string }) {
  const { user, isLoading: authLoading } = useAuthContext()
  const router = useRouter()

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

  const toggleEditMode = () => {
    setEditMode((prev) => !prev)
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(
        "/auth/login?message=Debes iniciar sesión para acceder a esta página",
      )
    }
  }, [user, authLoading, router])

  useEffect(() => {
    setCalendar(null)
    setEvents([])
    setProfile(null)
  }, [calendarSlug])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setIsLoading(true)

        const slug =
          calendarSlug === "personal"
            ? `${calendarSlug}-${user.$id}`
            : calendarSlug

        const calendarResult = await getCalendarBySlug(slug)

        if (!calendarResult) {
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
            const eventsResult = await getEvents(
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

    if (user) {
      void fetchData()
    }
  }, [user, calendarSlug, refetchTrigger])

  // Mostrar skeleton mientras el auth está cargando
  if (authLoading || isLoading) return <CalendarSkeleton />

  if (!user) {
    return null
  }

  if (!calendar) {
    return <CalendarNotFound />
  }

  if (calendar.requireConfig && !canGetEvents(calendar, profile)) {
    return (
      <StatusMessage
        type="warning"
        title="Completa tu información"
        description="Para acceder a este calendario, necesitas completar la información de tu cuenta"
        button={
          <div className="flex justify-center">
            <ConfigDialog>
              <Button className="bg-yellow-600 text-white shadow-lg hover:scale-105 hover:bg-yellow-700 hover:shadow-xl dark:bg-yellow-500 dark:hover:bg-yellow-600">
                <Settings className="size-4" />
                Completar ahora
              </Button>
            </ConfigDialog>
          </div>
        }
      />
    )
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
