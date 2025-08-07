"use client"

import { useCallback, useMemo, useState } from "react"

import type { CalendarEvent, Etiquette } from "@/components/calendar/types"

interface UseCalendarFiltersProps {
  etiquettes: Etiquette[]
  events: CalendarEvent[]
}

interface UseCalendarFiltersReturn {
  visibleColors: string[]
  isEtiquetteVisible: (color: string | undefined) => boolean
  toggleEtiquetteVisibility: (color: string) => void
  visibleEvents: CalendarEvent[]
  resetFilters: () => void
  activeFiltersCount: number
}

export function useCalendarFilters({
  etiquettes,
  events,
}: UseCalendarFiltersProps): UseCalendarFiltersReturn {
  // Estado local para colores visibles - inicializado con etiquetas activas
  const [visibleColors, setVisibleColors] = useState<string[]>(() => {
    return etiquettes
      .filter((etiquette) => etiquette.isActive)
      .map((etiquette) => etiquette.color)
  })

  // Función para alternar visibilidad de color
  const toggleEtiquetteVisibility = useCallback((color: string) => {
    setVisibleColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color)
      } else {
        return [...prev, color]
      }
    })
  }, [])

  // Función para verificar si un color es visible
  const isEtiquetteVisible = useCallback(
    (color: string | undefined) => {
      if (!color) return true // Eventos sin color siempre visibles
      return visibleColors.includes(color)
    },
    [visibleColors],
  )

  // Eventos filtrados SOLO por colores visibles
  const visibleEvents = useMemo(() => {
    return events.filter((event) =>
      event.color ? isEtiquetteVisible(event.color) : true,
    )
  }, [events, isEtiquetteVisible])

  // Resetear filtros a estado inicial
  const resetFilters = useCallback(() => {
    setVisibleColors(
      etiquettes
        .filter((etiquette) => etiquette.isActive)
        .map((etiquette) => etiquette.color),
    )
  }, [etiquettes])

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    const totalColors = etiquettes.length
    const visibleCount = visibleColors.length
    return totalColors - visibleCount
  }, [etiquettes.length, visibleColors.length])

  return {
    visibleColors,
    isEtiquetteVisible,
    toggleEtiquetteVisibility,
    visibleEvents,
    resetFilters,
    activeFiltersCount,
  }
}
