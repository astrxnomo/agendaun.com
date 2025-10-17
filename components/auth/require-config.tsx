"use client"

import { CalendarCog, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"

import { AuthCard, AuthContent, AuthFooter, AuthIcon } from "../ui/auth-card"
import { ConfigDialog } from "./config-dialog"

export function RequireConfig() {
  return (
    <AuthCard compact>
      <div className="space-y-6">
        <AuthIcon color="yellow" animate>
          <CalendarCog className="size-8" />
        </AuthIcon>
        <AuthContent
          title="Completa tu información"
          description="Para acceder a este calendario, necesitas completar tu información"
        />
      </div>

      <div className="space-y-6">
        <ConfigDialog>
          <Button
            size="lg"
            className="bg-yellow-600 text-white shadow-lg hover:scale-105 hover:bg-yellow-700 hover:shadow-xl dark:bg-yellow-500 dark:hover:bg-yellow-600"
          >
            <Settings />
            Configurar ahora
          </Button>
        </ConfigDialog>

        <AuthFooter>
          Selecciona tu sede, facultad y programa académico
        </AuthFooter>
      </div>
    </AuthCard>
  )
}
