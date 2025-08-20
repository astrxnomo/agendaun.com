/**
 * @fileoverview Data Hook - Calendar Data Management
 * @description Hook para manejar la carga y gestión de datos del calendario (eventos y etiquetas)
 * @category Data Hooks
 */

"use client"

import { useEffect, useState } from "react"

import { getEtiquettes } from "@/lib/actions/etiquettes.actions"
import { getEvents } from "@/lib/actions/events.actions"

import type { Calendars, Etiquettes, Events } from "@/types"

// ===== TYPES =====

interface CalendarData {
  events: Events[]
  etiquettes: Etiquettes[]
}

interface UseCalendarDataResult {
  data: CalendarData | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// ===== HOOK =====

/**
 * Hook para cargar y gestionar datos del calendario
 * @param calendar - Objeto calendario del cual cargar los datos
 * @returns Objeto con datos, estados de carga/error y función de refetch
 */
export function useCalendarData(
  calendar: Calendars | null,
): UseCalendarDataResult {
  const [data, setData] = useState<CalendarData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!calendar) {
      setError("Calendario no encontrado")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const [events, etiquettes] = await Promise.all([
        getEvents(calendar.$id),
        getEtiquettes(calendar.$id),
      ])

      setData({ events, etiquettes })
    } catch (err) {
      console.error("Error loading calendar data:", err)
      setError("Error al cargar los datos del calendario")
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    void fetchData()
  }

  useEffect(() => {
    void fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendar?.$id])

  return {
    data,
    isLoading,
    error,
    refetch,
  }
}
