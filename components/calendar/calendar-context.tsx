/**
 * @fileoverview Calendar UI Context - State Management
 * @description Contexto para manejo de estado de UI del calendario (fechas, etiquetas visibles, filtros académicos)
 * @category UI Contexts
 */

"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { Etiquettes } from "@/types"

// ===== TYPES =====

// Tipos para filtros académicos
export interface AcademicFilters {
  sede: string
  facultad: string
  programa: string
}

// Tipo para identificar calendarios
export type CalendarId =
  | "personal"
  | "national"
  | "sede"
  | "facultad"
  | "programa"

interface CalendarContextType {
  // Date management
  currentDate: Date
  setCurrentDate: (date: Date) => void

  // Etiquette visibility management per calendar
  visibleEtiquettes: Record<CalendarId, string[]>
  toggleEtiquetteVisibility: (calendarId: CalendarId, color: string) => void
  isEtiquetteVisible: (
    calendarId: CalendarId,
    color: string | undefined,
  ) => boolean
  setCalendarEtiquettes: (
    calendarId: CalendarId,
    etiquettes: Etiquettes[],
  ) => void

  // Academic filters (shared across calendars)
  academicFilters: AcademicFilters
  setAcademicFilter: (filterType: keyof AcademicFilters, value: string) => void
  clearAcademicFilters: () => void
}

// ===== CONTEXT CREATION =====

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
)

// ===== CONTEXT HOOK =====

/**
 * Hook para acceder al contexto de UI del calendario
 * @throws Error si se usa fuera del CalendarProvider
 * @returns Contexto de UI del calendario
 */
export function useCalendarContext() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error("useCalendarContext must be used within a CalendarProvider")
  }
  return context
}

// ===== PROVIDER PROPS =====

interface CalendarProviderProps {
  children: ReactNode
}

// ===== PROVIDER COMPONENT =====

/**
 * Proveedor de contexto para UI del calendario
 * Maneja estado de fechas, visibilidad de etiquetas y filtros académicos
 * @param children - Componentes hijos que tendrán acceso al contexto
 */
export function CalendarProvider({ children }: CalendarProviderProps) {
  // ===== STATE MANAGEMENT =====

  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // Initialize visibleEtiquettes per calendar (empty by default)
  const [visibleEtiquettes, setVisibleEtiquettes] = useState<
    Record<CalendarId, string[]>
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

  // ===== ETIQUETTE ACTIONS =====

  // Set calendar etiquettes and initialize visibility based on isActive
  const setCalendarEtiquettes = useCallback(
    (calendarId: CalendarId, etiquettes: Etiquettes[]) => {
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
    (calendarId: CalendarId, color: string) => {
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
    (calendarId: CalendarId, color: string | undefined) => {
      if (!color) return true // Events without a color are always visible
      const calendarEtiquettes = visibleEtiquettes[calendarId] || []
      return calendarEtiquettes.includes(color)
    },
    [visibleEtiquettes],
  )

  // ===== ACADEMIC FILTER ACTIONS =====

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

  // ===== CONTEXT VALUE =====

  const value = useMemo(
    () => ({
      currentDate,
      setCurrentDate,
      visibleEtiquettes,
      toggleEtiquetteVisibility,
      isEtiquetteVisible,
      setCalendarEtiquettes,
      academicFilters,
      setAcademicFilter,
      clearAcademicFilters,
    }),
    [
      currentDate,
      setCurrentDate,
      visibleEtiquettes,
      toggleEtiquetteVisibility,
      isEtiquetteVisible,
      setCalendarEtiquettes,
      academicFilters,
      setAcademicFilter,
      clearAcademicFilters,
    ],
  )

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}
