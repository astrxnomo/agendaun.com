"use client"

import { useCallback, useEffect, useState } from "react"

import { getEtiquettes } from "@/lib/actions/etiquettes.actions"
import { getCalendarEvents } from "@/lib/actions/events.actions"
import { getCurrentUserProfile } from "@/lib/actions/profile.actions"

import type { Calendars, Etiquettes, Events, Profiles } from "@/types"

interface UseUnifiedCalendarResult {
  events: Events[]
  etiquettes: Etiquettes[]

  isLoading: boolean
  error: string | null

  refetch: () => void

  visibleEtiquettes: string[]
  toggleEtiquetteVisibility: (etiquetteId: string) => void
  isEtiquetteVisible: (etiquetteId: string | undefined) => boolean
  calendar: string
}

export function useCalendar(
  calendar: Calendars | null,
): UseUnifiedCalendarResult {
  const [events, setEvents] = useState<Events[]>([])
  const [etiquettes, setEtiquettes] = useState<Etiquettes[]>([])
  const [visibleEtiquettes, setVisibleEtiquettes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<Profiles | null>(null)
  const [profileLoaded, setProfileLoaded] = useState(false)

  const loadUserProfile = useCallback(async () => {
    if (profileLoaded) return

    try {
      const profile = await getCurrentUserProfile()
      setUserProfile(profile)
    } catch (error) {
      console.error("Error loading user profile:", error)
      setUserProfile(null)
    } finally {
      setProfileLoaded(true)
    }
  }, [profileLoaded])

  const fetchData = useCallback(async () => {
    if (!calendar) {
      setError("Calendario no encontrado")
      setIsLoading(false)
      return
    }

    if (!profileLoaded) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const [eventsData, etiquettesData] = await Promise.all([
        getCalendarEvents(calendar, userProfile),
        getEtiquettes(calendar.$id),
      ])

      setEvents(eventsData)
      setEtiquettes(etiquettesData)

      const activeEtiquetteIds = etiquettesData
        .filter((etiquette: Etiquettes) => etiquette.isActive)
        .map((etiquette: Etiquettes) => etiquette.$id)
      setVisibleEtiquettes(activeEtiquetteIds)
    } catch {
      setError("Error al cargar los datos del calendario")
    } finally {
      setIsLoading(false)
    }
  }, [calendar, userProfile, profileLoaded])

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
  useEffect(() => {
    void loadUserProfile()
  }, [loadUserProfile])

  useEffect(() => {
    if (profileLoaded) {
      void fetchData()
    }
  }, [fetchData, profileLoaded])

  return {
    events,
    etiquettes,
    isLoading,
    error,
    refetch: fetchData,
    visibleEtiquettes,
    toggleEtiquetteVisibility,
    isEtiquetteVisible,
    calendar: calendar?.slug || "unknown",
  }
}
