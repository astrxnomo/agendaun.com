"use client"

import { CalendarSync } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import {
  EditModeToggle,
  EtiquettesHeader,
  EtiquettesManager,
  SetupCalendar,
} from "@/components/calendar"
import {
  CalendarError,
  CalendarSkeleton,
} from "@/components/skeletons/calendar-loading"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuthContext } from "@/contexts/auth-context"
import { getCalendarBySlug } from "@/lib/actions/calendars.actions"
import { getCalendarEvents } from "@/lib/actions/events.actions"
import { userCanEdit } from "@/lib/actions/users.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"

import { RequireConfig } from "../auth/require-config"

import type { Calendars, Etiquettes, Events } from "@/types"

export default function Calendar({ calendarSlug }: { calendarSlug: string }) {
  const { user, profile } = useAuthContext()

  const [calendar, setCalendar] = useState<Calendars | null>(null)
  const [events, setEvents] = useState<Events[]>([])
  const [etiquettes, setEtiquettes] = useState<Etiquettes[]>([])
  const [visibleEtiquettes, setVisibleEtiquettes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [canEdit, setCanEdit] = useState(false)

  const manualRefetch = () => {
    setCalendar(null)
    setEvents([])
    setEtiquettes([])
    setError(null)
    setRefreshTrigger((prev) => prev + 1)
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
    if (!canEdit) {
      toast.error("No tienes permisos para editar este calendario")
      return
    }
    setEditMode(!editMode)
  }

  useEffect(() => {
    setCalendar(null)
    setEvents([])
    setEtiquettes([])
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
          toast.error("Error cargando calendario", {
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
          console.warn("Error checking permissions:", permissionsResult.message)
          setCanEdit(false)
        } else {
          setCanEdit(permissionsResult)
        }

        const eventsResult = await getCalendarEvents(calendarResult)
        if (isAppwriteError(eventsResult)) {
          toast.error("Error cargando eventos", {
            description: eventsResult.type,
          })
          return
        }

        setEvents(eventsResult)

        const etiquettes = Array.isArray(calendarResult.etiquettes)
          ? calendarResult.etiquettes
          : []

        setEtiquettes(etiquettes)

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
  }, [user, profile, calendarSlug, refreshTrigger])

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
        etiquettes={etiquettes}
        isEtiquetteVisible={isEtiquetteVisible}
        toggleEtiquetteVisibility={toggleEtiquetteVisibility}
        etiquettesManager={
          editMode && (
            <EtiquettesManager
              etiquettes={etiquettes}
              calendar={calendar}
              onUpdate={manualRefetch}
            />
          )
        }
        editButton={
          canEdit && (
            <EditModeToggle
              checked={editMode}
              onCheckedChange={toggleEditMode}
              disabled={!canEdit}
            />
          )
        }
        syncButton={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={manualRefetch}>
                <CalendarSync />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Actualizar calendario</p>
            </TooltipContent>
          </Tooltip>
        }
      />

      <div className="flex-1">
        <SetupCalendar
          calendar={calendar}
          events={visibleEvents}
          etiquettes={etiquettes}
          onEventsUpdate={setEvents}
          editable={editMode}
          canEdit={canEdit}
          initialView={calendar.defaultView}
        />
      </div>
    </>
  )
}
