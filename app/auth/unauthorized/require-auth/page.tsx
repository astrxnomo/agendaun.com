import { Lock, LogIn } from "lucide-react"
import { type Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Acceso Requerido - AgendaUN",
  description:
    "Inicia sesión para acceder a todas las funcionalidades de AgendaUN, tu plataforma académica universitaria.",
}

export default function RequireAuthPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Acceso requerido", isCurrentPage: true },
        ]}
      />

      <main className="flex min-h-[70vh] w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-primary/10 absolute inset-0 scale-150 rounded-full blur-xl"></div>

                <div className="from-primary/5 to-primary/10 border-primary/10 relative animate-pulse rounded-2xl border bg-gradient-to-br p-6 shadow-sm">
                  <Lock className="text-primary size-8" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                Acceso requerido
              </h1>
              <p className="text-muted-foreground mx-auto text-sm leading-relaxed">
                Para acceder a esta pagina necesitas iniciar sesión
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
