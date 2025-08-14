// app/loading.tsx
"use client"

import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

export default function Loaging() {
  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-5 text-center">
        {/* Ícono animado */}
        <div className="flex justify-center">
          <div className="relative">
            <div
              className={cn(
                "absolute inset-0 scale-150 rounded-full bg-emerald-500/10 blur-xl",
              )}
            />
            <div
              className={cn(
                "relative rounded-2xl border bg-gradient-to-br p-6 shadow-sm",
                "animate-pulse border-emerald-500/20 from-emerald-500/5 to-emerald-500/10",
              )}
            >
              <LoaderCircle className="size-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Texto de carga */}
        <div className="space-y-3">
          <h1 className="text-foreground text-2xl font-semibold">
            Cargando aplicación
          </h1>
          <p className="text-muted-foreground mx-auto text-sm">
            Por favor espera mientras preparamos todo para ti...
          </p>
        </div>
      </div>
    </main>
  )
}
