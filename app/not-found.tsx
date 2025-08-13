import { Home, MonitorX } from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "404", isCurrentPage: true },
  ]

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <main className="flex min-h-[70vh] w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-10 text-center">
          {/* Header Section */}
          <div className="space-y-6">
            {/* Icon with elegant background */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-destructive/10 absolute inset-0 scale-150 rounded-full blur-xl"></div>
                <div className="from-destructive/5 to-destructive/10 border-destructive/20 relative rounded-2xl border bg-gradient-to-br p-6 shadow-sm">
                  <MonitorX className="text-destructive size-8" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                Página no encontrada
              </h1>
              <p className="text-muted-foreground mx-auto text-sm leading-relaxed">
                La página que intentas visitar no existe o cambió de ubicación.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Button variant="outline" asChild>
              <Link href="/">
                <Home />
                Inicio
              </Link>
            </Button>

            <div className="border-border/30 border-t pt-4 text-center">
              <p className="text-muted-foreground/80 text-xs">
                Usa el{" "}
                <span className="text-muted-foreground font-medium">
                  panel lateral
                </span>{" "}
                para navegar
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
