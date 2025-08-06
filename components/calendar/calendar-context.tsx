"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import { calendarColors } from "@/components/calendar/colors"
import { useFilters } from "@/components/filters-context"

import { type CalendarEvent } from "./types"

interface CalendarContextType {
  // Date management
  currentDate: Date
  setCurrentDate: (date: Date) => void

  // Etiquette visibility management
  visibleColors: string[]
  toggleColorVisibility: (color: string) => void
  isColorVisible: (color: string | undefined) => boolean

  // Event filtering by academic filters
  filterEventsByAcademicFilters: (events: CalendarEvent[]) => CalendarEvent[]
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
)

export function useCalendarContext() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error("useCalendarContext must be used within a CalendarProvider")
  }
  return context
}

interface CalendarProviderProps {
  children: ReactNode
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const { filters } = useFilters()

  // Initialize visibleColors with all available colors by default
  const [visibleColors, setVisibleColors] = useState<string[]>(() => {
    return calendarColors.map((color) => color.value)
  })

  // Toggle visibility of a color
  const toggleColorVisibility = (color: string) => {
    setVisibleColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color)
      } else {
        return [...prev, color]
      }
    })
  }

  // Check if a color is visible
  const isColorVisible = (color: string | undefined) => {
    // Events without a color use "gray" by default
    const eventColor = color || "gray"
    return visibleColors.includes(eventColor)
  }

  // Filter events by academic filters (sede, facultad, programa)
  const filterEventsByAcademicFilters = (events: CalendarEvent[]) => {
    return events.filter((event) => {
      // NIVEL NACIONAL: Si no hay filtros activos, mostrar todos los eventos
      if (!filters.sede && !filters.facultad && !filters.programa) {
        return true
      }

      // NIVEL SEDE: Si solo hay filtro de sede, mostrar eventos de esa sede
      if (filters.sede && !filters.facultad && !filters.programa) {
        // Mostrar eventos que pertenecen a esta sede
        // También incluir eventos sin sede específica (eventos nacionales que aplican a todas las sedes)
        return !event.sede || event.sede === filters.sede
      }

      // NIVEL FACULTAD: Si hay sede y facultad, mostrar eventos de esa facultad
      if (filters.sede && filters.facultad && !filters.programa) {
        // Si el evento no tiene sede, debe mostrarse (es nacional)
        if (!event.sede) return true
        // Si tiene sede, debe coincidir con la sede filtrada
        if (event.sede !== filters.sede) return false

        // Si el evento no tiene facultad, debe mostrarse (es de toda la sede)
        if (!event.facultad) return true
        // Si tiene facultad, debe coincidir con la facultad filtrada
        return event.facultad === filters.facultad
      }

      // NIVEL PROGRAMA: Si hay sede, facultad y programa, mostrar eventos específicos del programa
      if (filters.sede && filters.facultad && filters.programa) {
        // Si el evento no tiene sede, debe mostrarse (es nacional)
        if (!event.sede) return true
        // Si tiene sede, debe coincidir con la sede filtrada
        if (event.sede !== filters.sede) return false

        // Si el evento no tiene facultad, debe mostrarse (es de toda la sede)
        if (!event.facultad) return true
        // Si tiene facultad, debe coincidir con la facultad filtrada
        if (event.facultad !== filters.facultad) return false

        // Si el evento no tiene programa, debe mostrarse (es de toda la facultad)
        if (!event.programa) return true
        // Si tiene programa, debe coincidir con el programa filtrado
        return event.programa === filters.programa
      }

      // Casos edge: filtros parciales incompletos
      if (filters.facultad && !filters.sede) {
        return !event.facultad || event.facultad === filters.facultad
      }

      if (filters.programa && !filters.facultad) {
        return !event.programa || event.programa === filters.programa
      }

      return true
    })
  }

  const value = {
    currentDate,
    setCurrentDate,
    visibleColors,
    toggleColorVisibility,
    isColorVisible,
    filterEventsByAcademicFilters,
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}
