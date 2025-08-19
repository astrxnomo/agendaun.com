"use client"

import { useEffect, useState } from "react"

import {
  getCalendarPermissions,
  getNationalCalendarPermissions,
} from "@/lib/actions/calendars.actions"

export interface CalendarPermissions {
  canRead: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
}

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

/**
 * Hook específico para permisos del calendario nacional basado en teams
 */
export function useNationalCalendarPermissions(calendarId?: string): {
  permissions: CalendarPermissions
  isLoading: boolean
} {
  const [permissions, setPermissions] = useState<CalendarPermissions>({
    canRead: true, // Por defecto, todos pueden leer el calendario nacional
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkPermissions() {
      if (!calendarId) {
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
        const calendarPermissions =
          await getNationalCalendarPermissions(calendarId)
        setPermissions(calendarPermissions)
      } catch (error) {
        console.error("Error checking national calendar permissions:", error)
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
  }, [calendarId])

  return { permissions, isLoading }
}
