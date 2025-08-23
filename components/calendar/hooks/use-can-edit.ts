"use client"

import { useCallback, useEffect, useState } from "react"

import { userCanEdit } from "@/lib/actions/teams.actions"

export function useCanEdit(calendarSlug: string) {
  const [canEdit, setCanEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkPermissions = useCallback(async () => {
    if (!calendarSlug) {
      setCanEdit(false)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const hasPermission = await userCanEdit(calendarSlug)
      setCanEdit(hasPermission)
    } catch (err) {
      console.error("Error checking edit permissions:", err)
      setError("Error al verificar permisos")
      setCanEdit(false)
    } finally {
      setIsLoading(false)
    }
  }, [calendarSlug])

  const refetchPermissions = useCallback(() => {
    void checkPermissions()
  }, [checkPermissions])

  useEffect(() => {
    void checkPermissions()
  }, [checkPermissions])

  return {
    canEdit,
    isLoading,
    error,
    refetchPermissions,
  }
}
