// Importar estilos globales y fuentes
import "./globals.css"

import { FileQuestion, Home } from "lucide-react"
import { Outfit } from "next/font/google"

import type { Metadata } from "next"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "404 - Página no encontrada",
  description: "La página que buscas no existe o no tienes acceso a ella.",
}

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`dark ${outfit.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <main className="flex min-h-screen w-full items-center justify-center px-6 py-16">
          <div className="w-full max-w-md space-y-10 text-center">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="bg-destructive/10 absolute inset-0 scale-150 rounded-full blur-xl"></div>
                  <div className="from-destructive/5 to-destructive/10 border-destructive/20 relative rounded-2xl border bg-gradient-to-br p-6 shadow-sm">
                    <FileQuestion className="text-destructive size-8" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                  Página no encontrada
                </h1>
                <p className="text-muted-foreground mx-auto text-sm leading-relaxed">
                  La página que buscas no existe o no tienes acceso a ella.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <a
                href="/"
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Home className="size-4" />
                Volver al Inicio
              </a>

              <div className="border-border/30 border-t pt-4 text-center">
                <p className="text-muted-foreground/80 text-xs">
                  Si crees que esto es un error, por favor contáctanos
                </p>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
