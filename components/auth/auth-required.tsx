import { Lock, LogIn } from "lucide-react"
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
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 scale-150 rounded-full bg-amber-500/10 blur-xl"></div>
                <div className="relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-6 shadow-sm">
                  <Lock className="size-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                Acceso restringido
              </h1>
              <p className="text-muted-foreground mx-auto text-sm leading-relaxed">
                Necesitas iniciar sesión para acceder a esta página
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Button size="lg" asChild>
              <Link href="/auth/login">
                <LogIn />
                Iniciar sesión
              </Link>
            </Button>

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
