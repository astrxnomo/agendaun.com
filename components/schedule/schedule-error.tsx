import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function ScheduleError() {
  return (
    <main className="flex min-h-[60vh] w-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-10 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-destructive/10 flex h-20 w-20 items-center justify-center rounded-full">
                <AlertCircle className="text-destructive h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Error al cargar horario
            </h1>
            <p className="text-muted-foreground mx-auto text-sm leading-relaxed">
              El horario que buscas no existe o no está disponible.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Button variant="outline" asChild>
            <Link href="/schedules">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a horarios
            </Link>
          </Button>

          <div className="border-border/30 border-t pt-4 text-center">
            <p className="text-muted-foreground text-xs">
              Si crees que esto es un error, por favor contacta al soporte.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
