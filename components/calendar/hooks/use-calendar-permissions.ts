/**
 * @fileoverview Permission Hooks - Calendar Permissions Management
 * @description Hooks para manejar permisos de calendario según tipo y contexto
 * @category Permission Hooks
 */

"use client"

import { useEffect, useState } from "react"

import { getCalendarPermissions } from "@/lib/actions/calendars.actions"

// ===== TYPES =====

export interface CalendarPermissions {
  canRead: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
}

// ===== BASIC PERMISSIONS HOOK =====

/**
 * Hook base para obtener permisos de calendario
 * @param calendarId - ID del calendario
 * @returns Permisos y estado de carga
 */
export function useCalendarPermissions(calendarId?: string): {
  permissions: CalendarPermissions
  isLoading: boolean
} {
  const [permissions, setPermissions] = useState<CalendarPermissions>({
    canRead: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkPermissions() {
      if (!calendarId) {
        setPermissions({
          canRead: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
        })
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const calendarPermissions = await getCalendarPermissions(calendarId)
        setPermissions(calendarPermissions)
      } catch (error) {
        console.error("Error checking calendar permissions:", error)
        setPermissions({
          canRead: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
        })
      } finally {
        setIsLoading(false)
      }
    }

    void checkPermissions()
  }, [calendarId])

  return { permissions, isLoading }
}

// ===== TEAM PERMISSIONS HOOK =====

/**
 * Hook dinámico para permisos de calendarios basados en teams
 * @param calendarId - ID del calendario
 * @param requiredRole - Rol requerido para permisos avanzados
 * @returns Permisos y estado de carga
 */
export function useTeamCalendarPermissions(
  calendarId?: string,
  requiredRole?: string,
): {
  permissions: CalendarPermissions
  isLoading: boolean
} {
  const [permissions, setPermissions] = useState<CalendarPermissions>({
    canRead: true, // Por defecto, todos pueden leer
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkPermissions() {
      if (!calendarId || !requiredRole) {
        setPermissions({
          canRead: true,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
        })
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const { getCalendarTeamPermissions } = await import(
          "@/lib/actions/calendars.actions"
        )
        const calendarPermissions = await getCalendarTeamPermissions(
          calendarId,
          requiredRole,
        )
        setPermissions(calendarPermissions)
      } catch (error) {
        console.error("Error checking team calendar permissions:", error)
        setPermissions({
          canRead: true, // Mantener lectura por defecto
          canCreate: false,
          canUpdate: false,
          canDelete: false,
        })
      } finally {
        setIsLoading(false)
      }
    }

    void checkPermissions()
  }, [calendarId, requiredRole])

  return { permissions, isLoading }
}

// ===== DYNAMIC PERMISSIONS HOOK =====

/**
 * Hook dinámico que selecciona el tipo de permisos correcto según el tipo de calendario
 * @param calendarId - ID del calendario
 * @param calendarType - Tipo de calendario
 * @param slug - Slug para calendarios específicos
 * @returns Permisos y estado de carga
 */
export function useDynamicCalendarPermissions(
  calendarId?: string,
  calendarType?: "national" | "sede" | "facultad" | "programa" | "personal",
  slug?: string,
): {
  permissions: CalendarPermissions
  isLoading: boolean
} {
  const nationalPerms = useNationalCalendarPermissions(
    calendarType === "national" ? calendarId : undefined,
  )
  const sedePerms = useSedeCalendarPermissions(
    calendarType === "sede" ? calendarId : undefined,
    calendarType === "sede" ? slug : undefined,
  )
  const facultadPerms = useFacultadCalendarPermissions(
    calendarType === "facultad" ? calendarId : undefined,
    calendarType === "facultad" ? slug : undefined,
  )
  const programaPerms = useProgramaCalendarPermissions(
    calendarType === "programa" ? calendarId : undefined,
    calendarType === "programa" ? slug : undefined,
  )
  const basicPerms = useCalendarPermissions(
    !calendarType || calendarType === "personal" ? calendarId : undefined,
  )

  // Retornar permisos según el tipo
  switch (calendarType) {
    case "national":
      return nationalPerms
    case "sede":
      return sedePerms
    case "facultad":
      return facultadPerms
    case "programa":
      return programaPerms
    default:
      return basicPerms
  }
}

// ===== SPECIFIC CALENDAR TYPE PERMISSION HOOKS =====

/**
 * Hook específico para permisos del calendario nacional basado en teams
 * @param calendarId - ID del calendario nacional
 * @returns Permisos y estado de carga
 */
export function useNationalCalendarPermissions(calendarId?: string): {
  permissions: CalendarPermissions
  isLoading: boolean
} {
  return useTeamCalendarPermissions(calendarId, "calendar-national")
}

/**
 * Hook específico para permisos del calendario de sede basado en teams
 * @param calendarId - ID del calendario de sede
 * @param sedeSlug - Slug de la sede para el rol específico
 * @returns Permisos y estado de carga
 */
export function useSedeCalendarPermissions(
  calendarId?: string,
  sedeSlug?: string,
): {
  permissions: CalendarPermissions
  isLoading: boolean
} {
  const requiredRole = sedeSlug ? `calendar-sede-${sedeSlug}` : undefined
  return useTeamCalendarPermissions(calendarId, requiredRole)
}

/**
 * Hook específico para permisos del calendario de facultad basado en teams
 * @param calendarId - ID del calendario de facultad
 * @param facultadSlug - Slug de la facultad para el rol específico
 * @returns Permisos y estado de carga
 */
export function useFacultadCalendarPermissions(
  calendarId?: string,
  facultadSlug?: string,
): {
  permissions: CalendarPermissions
  isLoading: boolean
} {
  const requiredRole = facultadSlug
    ? `calendar-facultad-${facultadSlug}`
    : undefined
  return useTeamCalendarPermissions(calendarId, requiredRole)
}

/**
 * Hook específico para permisos del calendario de programa basado en teams
 * @param calendarId - ID del calendario de programa
 * @param programaSlug - Slug del programa para el rol específico
 * @returns Permisos y estado de carga
 */
export function useProgramaCalendarPermissions(
  calendarId?: string,
  programaSlug?: string,
): {
  permissions: CalendarPermissions
  isLoading: boolean
} {
  const requiredRole = programaSlug
    ? `calendar-programa-${programaSlug}`
    : undefined
  return useTeamCalendarPermissions(calendarId, requiredRole)
}
