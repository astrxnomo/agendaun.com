"use client"

import { Settings } from "lucide-react"
import { useEffect, useState } from "react"

import { ConfigDialog } from "@/components/auth/config-dialog"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/contexts/auth-context"

export function ConfigBanner() {
  const { profile } = useAuthContext()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Mostrar el banner solo si el perfil NO tiene sede, facultad ni programa
    if (profile && !profile.sede && !profile.faculty && !profile.program) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [profile])

  if (!isVisible) {
    return null
  }

  return (
    <div className="animate-in slide-in-from-bottom-5 fixed right-4 bottom-4 z-50 max-w-md duration-700">
      <div className="from-primary/10 via-primary/5 to-background border-primary/20 relative overflow-hidden rounded border-2 bg-gradient-to-br p-5 shadow-2xl backdrop-blur-md">
        <div className="via-primary/10 absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent to-transparent" />

        <div className="relative flex gap-4">
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-bold">
                ¡Completa tu perfil universitario!
              </h3>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                Completa tu información para ver eventos, horarios y contenido
                personalizado de tu{" "}
                <span className="text-primary font-semibold">sede</span>,{" "}
                <span className="text-primary font-semibold">facultad</span> y{" "}
                <span className="text-primary font-semibold">programa</span>.
              </p>
            </div>

            <ConfigDialog>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 w-full animate-pulse shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <Settings className="h-4 w-4" />
                Completar información
              </Button>
            </ConfigDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
