import { LoaderCircle } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"

export default function Loading() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Cargando...", isCurrentPage: true }]}
      />
      <main className="flex min-h-[70vh] w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-5 text-center">
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

          <div className="space-y-3">
            <h1 className="text-foreground text-2xl font-semibold">Cargando</h1>
            <p className="text-muted-foreground mx-auto text-sm">
              Espera un momento...
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
