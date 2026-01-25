"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useAuthContext } from "@/contexts/auth-context"
import { calendarEditMode } from "@/lib/actions/users"
import { getCalendarBySlug } from "@/lib/data/calendars/getBySlug"
import { getEvents } from "@/lib/data/calendars/getEvents"
import { getProfile } from "@/lib/data/profiles/getProfile"

import { PageHeader } from "@/components/layout/page-header"
import { useIsMobile } from "@/hooks/use-mobile"
import type {
  CalendarEtiquettes,
  CalendarEvents,
  Calendars,
  CalendarViews,
} from "@/lib/data/types"
import { EtiquettesHeader } from "./etiquettes/etiquettes-header"
import { CalendarNotFound } from "./not-found"
import { SetupCalendar } from "./setup-calendar"
import { CalendarSkeleton } from "./skeleton"

export default function Calendar({
  slug: calendarSlug,
  view,
}: {
  slug: string
  view?: CalendarViews
}) {
  const { user, isLoading: authLoading } = useAuthContext()
  const router = useRouter()
  const isMobile = useIsMobile()

  const [calendar, setCalendar] = useState<Calendars | null>(null)
  const [events, setEvents] = useState<CalendarEvents[]>([])
  const [visibleEtiquettes, setVisibleEtiquettes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const manualRefetch = () => {
    setRefetchTrigger((prev) => prev + 1)
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
    const isDemo = calendarSlug === "demo"
    
    if (!isDemo) {
      if (!authLoading && !user) {
        router.push(
          "/auth/login?message=Debes iniciar sesión para acceder a esta página",
        )
      }
    }
  }, [user, authLoading, router, calendarSlug])

  useEffect(() => {
    setCalendar(null)
    setEvents([])
  }, [calendarSlug])

  useEffect(() => {
    const fetchData = async () => {
      const isDemo = calendarSlug === "demo"
      
      // Para el calendario demo, no se requiere usuario autenticado
      if (!isDemo && !user) return

      try {
        setIsLoading(true)

        const slug =
          calendarSlug === "personal" && user
            ? `${calendarSlug}-${user.$id}`
            : calendarSlug

        const calendarResult = await getCalendarBySlug(slug)

        if (!calendarResult) {
          return
        }

        setCalendar(calendarResult)

        let currentProfile = null
        if (user) {
          try {
            currentProfile = await getProfile(user.$id)
          } catch (error) {
            console.error("Error cargando perfil:", error)
          }
        }

        // Para el calendario demo, permitir edición sin autenticación
        if (isDemo) {
          setCanEdit(true)
        } else if (user) {
          try {
            const canEditResult = await calendarEditMode(calendarResult)
            setCanEdit(canEditResult)
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Error cargando permisos"
            toast.error(errorMessage)
            setCanEdit(false)
          }
        }

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

    // Ejecutar fetchData si hay usuario o si es el calendario demo
    const isDemo = calendarSlug === "demo"
    if (user || isDemo) {
      void fetchData()
    }
  }, [user, calendarSlug, refetchTrigger])

  if (authLoading || isLoading) return <CalendarSkeleton />

  const isDemo = calendarSlug === "demo"
  if (!user && !isDemo) {
    return null
  }

  if (!calendar) {
    return <CalendarNotFound />
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
        initialView={isMobile ? "agenda" : view || calendar.defaultView}
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
