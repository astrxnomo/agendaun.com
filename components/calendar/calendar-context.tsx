"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"

import { type Etiquettes } from "@/types/db"

// Tipos para filtros académicos
export interface AcademicFilters {
  sede: string
  facultad: string
  programa: string
}

interface CalendarContextType {
  // Date management
  currentDate: Date
  setCurrentDate: (date: Date) => void

  // Etiquette visibility management per calendar
  visibleEtiquettes: Record<string, string[]>
  toggleEtiquetteVisibility: (calendarId: string, color: string) => void
  isEtiquetteVisible: (calendarId: string, color: string | undefined) => boolean
  setCalendarEtiquettes: (calendarId: string, etiquettes: Etiquettes[]) => void

  // Academic filters (shared across calendars)
  academicFilters: AcademicFilters
  setAcademicFilter: (filterType: keyof AcademicFilters, value: string) => void
  clearAcademicFilters: () => void
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

  // Initialize visibleEtiquettes per calendar (empty by default)
  const [visibleEtiquettes, setVisibleEtiquettes] = useState<
    Record<string, string[]>
  >({
    personal: [],
    national: [],
    sede: [],
    facultad: [],
    programa: [],
  })

  // Initialize academic filters
  const [academicFilters, setAcademicFilters] = useState<AcademicFilters>({
    sede: "",
    facultad: "",
    programa: "",
  })

  // Set calendar etiquettes and initialize visibility based on isActive
  const setCalendarEtiquettes = useCallback(
    (calendarId: string, etiquettes: Etiquettes[]) => {
      const activeColors = etiquettes
        .filter((etiquette) => etiquette.isActive)
        .map((etiquette) => etiquette.color)

      setVisibleEtiquettes((prev) => ({
        ...prev,
        [calendarId]: activeColors,
      }))
    },
    [],
  )

  // Toggle visibility of a color for a specific calendar
  const toggleEtiquetteVisibility = useCallback(
    (calendarId: string, color: string) => {
      setVisibleEtiquettes((prev) => {
        const currentCalendarEtiquettes = prev[calendarId] || []

        if (currentCalendarEtiquettes.includes(color)) {
          return {
            ...prev,
            [calendarId]: currentCalendarEtiquettes.filter((c) => c !== color),
          }
        } else {
          return {
            ...prev,
            [calendarId]: [...currentCalendarEtiquettes, color],
          }
        }
      })
    },
    [],
  )

  // Check if a color is visible for a specific calendar
  const isEtiquetteVisible = useCallback(
    (calendarId: string, color: string | undefined) => {
      if (!color) return true // Events without a color are always visible
      const calendarEtiquettes = visibleEtiquettes[calendarId] || []
      return calendarEtiquettes.includes(color)
    },
    [visibleEtiquettes],
  )

  // Set individual academic filter
  const setAcademicFilter = useCallback(
    (filterType: keyof AcademicFilters, value: string) => {
      setAcademicFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }))
    },
    [],
  )

  // Clear all academic filters
  const clearAcademicFilters = useCallback(() => {
    setAcademicFilters({
      sede: "",
      facultad: "",
      programa: "",
    })
  }, [])

  const value = {
    currentDate,
    setCurrentDate,
    visibleEtiquettes,
    toggleEtiquetteVisibility,
    isEtiquetteVisible,
    setCalendarEtiquettes,
    academicFilters,
    setAcademicFilter,
    clearAcademicFilters,
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}
