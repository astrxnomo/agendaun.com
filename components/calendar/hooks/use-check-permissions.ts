"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { userCanEdit } from "@/lib/actions/users.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"
import { type Calendars } from "@/types"

export function useCheckPermissions(calendar: Calendars) {
  const [canEdit, setCanEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkPermissions = useCallback(async () => {
    if (!calendar) {
      setCanEdit(false)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const result = await userCanEdit(calendar)

      if (isAppwriteError(result)) {
        toast.error("Error al actualizar evento", {
          description: result.type,
        })
        return
      }

      setCanEdit(result)
    } catch (err) {
      console.error("Error checking edit permissions:", err)
      setError("Error al verificar permisos")
      setCanEdit(false)
    } finally {
      setIsLoading(false)
    }
  }, [calendar])

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
