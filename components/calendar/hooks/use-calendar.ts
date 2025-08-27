"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { useCheckPermissions } from "@/components/calendar/hooks/use-check-permissions"
import { useAcademicConfig } from "@/contexts/academic-context"
import { getCalendarBySlug } from "@/lib/actions/calendars.actions"
import { getEtiquettes } from "@/lib/actions/etiquettes.actions"
import { getCalendarEvents } from "@/lib/actions/events.actions"
import { getUserProfile } from "@/lib/actions/profiles.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"

import type { Calendars, Etiquettes, Events, Profiles } from "@/types"

export function useCalendar(calendarSlug: string) {
  const academicConfig = useAcademicConfig()
  const [calendar, setCalendar] = useState<Calendars | null>(null)
  const [events, setEvents] = useState<Events[]>([])
  const [etiquettes, setEtiquettes] = useState<Etiquettes[]>([])
  const [visibleEtiquettes, setVisibleEtiquettes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<Profiles | null>(null)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  const {
    canEdit,
    isLoading: permissionsLoading,
    error: permissionsError,
    refetchPermissions,
  } = useCheckPermissions(calendar)

  const loadUserProfile = useCallback(async () => {
    if (profileLoaded) return

    try {
      const result = await getUserProfile()

      if (isAppwriteError(result)) {
        toast.error("Error cargando perfil de usuario", {
          description: result.type,
        })
        setUserProfile(null)
        return
      }

      setUserProfile(result)
    } catch (error) {
      console.error("Error loading user profile:", error)
      toast.error("Error cargando perfil de usuario")
      setUserProfile(null)
    } finally {
      setProfileLoaded(true)
    }
  }, [profileLoaded])

  const loadCalendar = useCallback(async () => {
    if (!calendarSlug) {
      setError("Slug de calendario no proporcionado")
      return null
    }

    try {
      const result = await getCalendarBySlug(
        calendarSlug === "personal"
          ? `${calendarSlug}-${userProfile?.user_id}`
          : calendarSlug,
      )

      if (isAppwriteError(result)) {
        toast.error("Error cargando calendario", {
          description: result.type,
        })
        setError("Error cargando calendario")
        return null
      }

      if (!result) {
        setError("Calendario no encontrado")
        return null
      }

      setCalendar(result)
      return result
    } catch (error) {
      console.error("Error loading calendar:", error)
      toast.error("Error cargando calendario")
      setError("Error cargando calendario")
      return null
    }
  }, [calendarSlug, userProfile?.user_id])

  const fetchData = useCallback(async () => {
    if (!profileLoaded || dataLoaded) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setDataLoaded(true)

      const calendarData = await loadCalendar()
      if (!calendarData) {
        setIsLoading(false)
        return
      }

      if (refetchPermissions) {
        refetchPermissions()
      }

      // Cargar datos del calendario
      const [eventsResult, etiquettesResult] = await Promise.all([
        getCalendarEvents(calendarData),
        getEtiquettes(calendarData.$id),
      ])

      if (isAppwriteError(eventsResult)) {
        toast.error("Error cargando eventos", {
          description: eventsResult.type,
        })
        setError("Error cargando eventos")
        return
      }

      if (isAppwriteError(etiquettesResult)) {
        toast.error("Error cargando etiquetas", {
          description: etiquettesResult.type,
        })
        setError("Error cargando etiquetas")
        return
      }

      setEvents(eventsResult)
      setEtiquettes(etiquettesResult)

      const activeEtiquetteIds = etiquettesResult
        .filter((etiquette: Etiquettes) => etiquette.isActive)
        .map((etiquette: Etiquettes) => etiquette.$id)
      setVisibleEtiquettes(activeEtiquetteIds)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Error al cargar los datos del calendario")
      setError("Error al cargar los datos del calendario")
    } finally {
      setIsLoading(false)
    }
  }, [profileLoaded, dataLoaded, loadCalendar, refetchPermissions])

  const toggleEtiquetteVisibility = useCallback((etiquetteId: string) => {
    setVisibleEtiquettes((prev) => {
      if (prev.includes(etiquetteId)) {
        return prev.filter((id) => id !== etiquetteId)
      } else {
        return [...prev, etiquetteId]
      }
    })
  }, [])

  const isEtiquetteVisible = useCallback(
    (etiquetteId: string | undefined) => {
      if (!etiquetteId) return true // Eventos sin etiqueta siempre son visibles
      return visibleEtiquettes.includes(etiquetteId)
    },
    [visibleEtiquettes],
  )

  const manualRefetch = useCallback(async () => {
    setDataLoaded(false)
    await fetchData()
  }, [fetchData])

  const updateEvents = useCallback((updater: (prev: Events[]) => Events[]) => {
    setEvents(updater)
  }, [])

  useEffect(() => {
    if (!profileLoaded) {
      void loadUserProfile()
    }
  }, [profileLoaded, loadUserProfile])

  useEffect(() => {
    setDataLoaded(false)
    setCalendar(null)
    setEvents([])
    setEtiquettes([])
    setError(null)
  }, [calendarSlug])

  useEffect(() => {
    if (profileLoaded && !dataLoaded) {
      void fetchData()
    }
  }, [profileLoaded, dataLoaded, fetchData])

  // Recargar datos cuando cambie la configuración académica
  useEffect(() => {
    if (profileLoaded) {
      setDataLoaded(false)
    }
  }, [
    academicConfig.selectedSede,
    academicConfig.selectedFaculty,
    academicConfig.selectedProgram,
    profileLoaded,
  ])

  return {
    calendar,
    events,
    etiquettes,
    isLoading: isLoading || permissionsLoading,
    error: error || permissionsError,
    refetch: manualRefetch,
    visibleEtiquettes,
    toggleEtiquetteVisibility,
    isEtiquetteVisible,
    canEdit,
    updateEvents,
  }
}
