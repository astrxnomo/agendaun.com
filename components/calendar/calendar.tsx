"use client"

import { CalendarSync } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { UserConfigDialog } from "@/components/auth/user-config"
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
import { useAcademicConfig } from "@/contexts/academic-context"
import { useAuthContext } from "@/contexts/auth-context"
import { getCalendarBySlug } from "@/lib/actions/calendars.actions"
import { getCalendarEvents } from "@/lib/actions/events.actions"
import { userCanEdit } from "@/lib/actions/users.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"

import type { Calendars, Etiquettes, Events } from "@/types"

export default function Calendar({ calendarSlug }: { calendarSlug: string }) {
  const academicConfig = useAcademicConfig()
  const { user } = useAuthContext()
  const { isAcademicConfigIncomplete } = academicConfig
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
  }, [
    user,
    calendarSlug,
    academicConfig.selectedSede,
    academicConfig.selectedFaculty,
    academicConfig.selectedProgram,
    refreshTrigger,
  ])

  if (isLoading) return <CalendarSkeleton />

  if (error) {
    return <CalendarError error={error} retry={manualRefetch} />
  }

  // Show academic setup prompt if configuration is incomplete
  if (isAcademicConfigIncomplete) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Configuración Académica Requerida
          </h2>
          <p className="text-muted-foreground max-w-md">
            Para ver el calendario, necesitas configurar tu sede, facultad y
            programa académico.
          </p>
        </div>

        <UserConfigDialog>
          <Button>Configurar Información Académica</Button>
        </UserConfigDialog>
      </div>
    )
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
