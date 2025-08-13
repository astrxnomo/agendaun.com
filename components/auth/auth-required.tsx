import { Lock } from "lucide-react"
import Link from "next/link"

import { PageHeader } from "../page-header"
import { Button } from "../ui/button"

export function AuthRequired() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Acceso restringido", isCurrentPage: true },
        ]}
      />
      <main className="flex min-h-[70vh] w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-10 text-center">
          {/* Header Section */}
          <div className="space-y-6">
            {/* Icon with elegant background */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 scale-150 rounded-full bg-amber-500/10 blur-xl"></div>
                <div className="relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-6 shadow-sm">
                  <Lock className="size-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
              <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                Acceso restringido
              </h1>
              <p className="text-muted-foreground mx-auto max-w-xs text-sm leading-relaxed">
                Esta página requiere autenticación para acceder a su contenido.
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="space-y-6">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-full rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              asChild
            >
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>

            {/* Footer */}
            <div className="border-border/30 border-t pt-4 text-center">
              <p className="text-muted-foreground/80 text-xs">
                Usa tu correo institucional{" "}
                <span className="text-muted-foreground font-medium">
                  (@unal.edu.co)
                </span>{" "}
                para acceder
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
