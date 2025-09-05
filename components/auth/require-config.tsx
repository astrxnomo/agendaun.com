"use client"

import { Settings } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ConfigDialog } from "./config-dialog"

export function RequireConfig() {
  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 scale-150 rounded-full bg-yellow-500/10 blur-xl dark:bg-yellow-400/10"></div>
              <div className="relative animate-pulse rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 p-6 shadow-sm dark:border-yellow-400/20 dark:from-yellow-400/5 dark:to-yellow-400/10">
                <Settings className="size-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Completa tu información
            </h1>
            <p className="text-muted-foreground mx-auto text-sm leading-relaxed">
              Para acceder a este calendario, necesitas completar tu información
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <ConfigDialog>
            <Button
              size="lg"
              className="transform animate-pulse bg-yellow-600 text-white shadow-lg hover:scale-105 hover:bg-yellow-700 hover:shadow-xl dark:bg-yellow-500 dark:hover:bg-yellow-600"
            >
              <Settings />
              Configurar ahora
            </Button>
          </ConfigDialog>

          <div className="border-border/30 border-t pt-4 text-center">
            <p className="text-muted-foreground/80 text-xs">
              Selecciona tu sede, facultad y programa académico
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
