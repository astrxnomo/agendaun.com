/**
 * @fileoverview Calendar Data Context - Data Management
 * @description Contexto para manejo de datos del calendario (eventos, etiquetas, permisos, acciones CRUD)
 * @category Data Contexts
 */

"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react"

import { useCalendarData } from "@/components/calendar/hooks/use-calendar-data"
import { useDynamicCalendarPermissions } from "@/components/calendar/hooks/use-calendar-permissions"
import { useEventHandlers } from "@/components/calendar/hooks/use-event-handlers"

import type { Calendars, Etiquettes, Events } from "@/types"
import type { CalendarPermissions } from "./hooks/use-calendar-permissions"

// ===== TYPES =====

// Determinar tipo de calendario por slug
export type CalendarType =
  | "national"
  | "sede"
  | "facultad"
  | "programa"
  | "personal"

/**
 * Función utilitaria para determinar el tipo de calendario basado en el slug
 * @param slug - Slug del calendario
 * @returns Tipo de calendario
 */
export function getCalendarType(slug: string): CalendarType {
  if (slug === "national-calendar") return "national"
  if (slug.startsWith("sede-")) return "sede"
  if (slug.startsWith("facultad-")) return "facultad"
  if (slug.startsWith("programa-")) return "programa"
  return "personal"
}

interface CalendarDataContextType {
  // Datos básicos
  calendar: Calendars
  events: Events[]
  etiquettes: Etiquettes[]
  permissions: CalendarPermissions
  calendarType: CalendarType

  // Estados
  isLoading: boolean
  error: string | null

  // Acciones
  refetch: () => void
  updateEvent: (event: Events) => Promise<void>
  deleteEvent: (eventId: string) => Promise<void>
  addEvent: (event: Events) => Promise<void>
}

// ===== CONTEXT CREATION =====

const CalendarDataContext = createContext<CalendarDataContextType | undefined>(
  undefined,
)

// ===== CONTEXT HOOK =====

/**
 * Hook para acceder al contexto de datos del calendario
 * @throws Error si se usa fuera del CalendarDataProvider
 * @returns Contexto de datos del calendario
 */
export function useCalendarDataContext() {
  const context = useContext(CalendarDataContext)
  if (context === undefined) {
    throw new Error(
      "useCalendarDataContext must be used within a CalendarDataProvider",
    )
  }
  return context
}

// ===== PROVIDER PROPS =====

interface CalendarDataProviderProps {
  calendar: Calendars
  children: ReactNode
}

// ===== PROVIDER COMPONENT =====

/**
 * Proveedor de contexto para datos del calendario
 * Combina datos, permisos y acciones en un contexto unificado
 * @param calendar - Configuración del calendario
 * @param children - Componentes hijos que tendrán acceso al contexto
 */
export function CalendarDataProvider({
  calendar,
  children,
}: CalendarDataProviderProps) {
  const calendarType = getCalendarType(calendar.slug)

  // ===== DATA HOOKS =====

  // Datos del calendario
  const {
    data,
    isLoading: dataLoading,
    error: dataError,
    refetch: refetchData,
  } = useCalendarData(calendar)

  // Permisos del calendario (hook dinámico basado en tipo)
  const { permissions, isLoading: permissionsLoading } =
    useDynamicCalendarPermissions(
      calendar.$id,
      calendarType,
      calendar.slug.split("-").slice(1).join("-"), // Extraer slug después del tipo
    )

  // ===== ACTION HANDLERS =====

  // Memoizar la función de refetch para evitar recreaciones innecesarias
  const stableRefetch = useCallback(() => {
    refetchData()
  }, [refetchData])

  // Event handlers unificados
  const eventHandlers = useEventHandlers({
    calendar,
    permissions,
    onEventsUpdate: stableRefetch,
  })

  const value = useMemo(
    (): CalendarDataContextType => ({
      // Datos básicos
      calendar,
      events: data?.events || [],
      etiquettes: data?.etiquettes || [],
      permissions,
      calendarType,

      // Estados combinados
      isLoading: dataLoading || permissionsLoading,
      error: dataError,

      // Acciones unificadas
      refetch: stableRefetch,
      updateEvent: eventHandlers.handleEventUpdate,
      deleteEvent: eventHandlers.handleEventDelete,
      addEvent: eventHandlers.handleEventAdd,
    }),
    [
      calendar,
      data,
      permissions,
      calendarType,
      dataLoading,
      permissionsLoading,
      dataError,
      stableRefetch,
      eventHandlers,
    ],
  )

  return (
    <CalendarDataContext.Provider value={value}>
      {children}
    </CalendarDataContext.Provider>
  )
}
