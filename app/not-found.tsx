import { Home } from "lucide-react"
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
      <main className="flex min-h-[70vh] w-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Página no encontrada
          </h1>
          <p className="text-muted-foreground my-3">
            La ruta que intentas visitar no existe o cambió de ubicación.
          </p>

          <Button asChild>
            <Link href="/">
              <Home /> Volver al inicio
            </Link>
          </Button>

          <p className="text-muted-foreground mt-8 text-xs">
            Usa el panel lateral para navegar entre secciones
          </p>
        </div>
      </main>
    </>
  )
}
