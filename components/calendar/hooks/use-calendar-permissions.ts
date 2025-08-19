"use client"

import { useEffect, useState } from "react"

import { getUser } from "@/lib/appwrite/auth"

export interface CalendarPermissions {
  canRead: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
}

/**
 * Hook simplificado para manejar permisos de calendario
 * Los permisos se manejan automáticamente por Appwrite según el usuario autenticado
 */
export function useCalendarPermissions(): CalendarPermissions {
  const [permissions, setPermissions] = useState<CalendarPermissions>({
    canRead: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  })

  useEffect(() => {
    async function checkPermissions() {
      try {
        const user = await getUser()
        if (user) {
          // Si el usuario está autenticado, tiene permisos completos
          // Appwrite maneja automáticamente a qué eventos puede acceder
          setPermissions({
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
          })
        } else {
          // Sin autenticación, sin permisos
          setPermissions({
            canRead: false,
            canCreate: false,
            canUpdate: false,
            canDelete: false,
          })
        }
      } catch (error) {
        console.error("Error checking permissions:", error)
        setPermissions({
          canRead: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
        })
      }
    }

    void checkPermissions()
  }, [])

  return permissions
}
