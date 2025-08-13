"use client"

import { Loader2, Mail, MailCheck, RotateCw, Shield } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendMagicLink } from "@/lib/auth"

import type React from "react"

interface LoginClientProps {
  searchParams?: {
    error?: string
    from?: string
  }
}

export default function LoginForm({
  searchParams: initialSearchParams,
}: LoginClientProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Obtener parámetros de la URL (tanto de props como de useSearchParams)
  const error = searchParams.get("error") || initialSearchParams?.error
  const from = searchParams.get("from") || initialSearchParams?.from

  const errorMessages = useMemo<Record<string, string>>(
    () => ({
      invalid_token: "El enlace no es válido o ha expirado.",
      session_failed: "No se pudo crear la sesión. Intenta de nuevo.",
      auth_failed: "Error de autenticación. Intenta de nuevo.",
      send_failed: "No se pudo enviar el enlace. Intenta de nuevo.",
      invalid_email: "Por favor ingresa un email válido.",
    }),
    [],
  )

  // Mostrar toast de error cuando se carga la página con error
  useEffect(() => {
    if (error && !emailSent) {
      toast.error(errorMessages[error] || "Ocurrió un error. Intenta de nuevo.")
    }
  }, [error, emailSent, errorMessages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("Por favor ingresa tu correo electrónico")
      return
    }

    if (!email.endsWith("@unal.edu.co")) {
      toast.error("Debes usar tu correo institucional (@unal.edu.co)")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      if (from) {
        formData.append("from", from)
      }

      const result = await sendMagicLink(formData)

      if (result.success) {
        setEmailSent(true)
        toast.success("¡Enlace enviado! Revisa tu correo electrónico")

        // Limpiar parámetros de error de la URL
        if (error) {
          const url = new URL(window.location.href)
          url.searchParams.delete("error")
          router.replace(url.pathname + url.search)
        }
      } else {
        toast.error(errorMessages[result.error || "send_failed"])
        if (result.error) {
          // Mantener la ruta correcta /login
          router.push(`/login?error=${result.error}`)
        }
      }
    } catch (error: unknown) {
      console.error("Login error:", error)
      toast.error("Error enviando el enlace de acceso")
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    if (error) {
      const url = new URL(window.location.href)
      url.searchParams.delete("error")
      router.replace(url.pathname + url.search)
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Iniciar sesión", isCurrentPage: true },
        ]}
      />

      <main className="flex min-h-[75vh] w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-10">
          {/* Header Section */}
          <div className="space-y-6 text-center">
            {/* Icon with elegant background */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-primary/10 absolute inset-0 scale-150 rounded-full blur-xl"></div>
                <div className="from-primary/5 to-primary/10 border-primary/10 relative rounded-2xl border bg-gradient-to-br p-6 shadow-sm">
                  {emailSent ? (
                    <MailCheck className="text-primary size-8" />
                  ) : (
                    <Mail className="text-primary size-8" />
                  )}
                </div>
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
              <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                {emailSent ? "¡Enlace enviado!" : "Iniciar sesión"}
              </h1>
              <p className="text-muted-foreground mx-auto text-sm leading-relaxed">
                {emailSent
                  ? "Revisa tu correo y haz clic en el enlace para acceder"
                  : "Ingresa tu correo institucional para acceder"}
              </p>
            </div>
          </div>

          {/* Alert Messages */}
          {error && !emailSent && (
            <div className="bg-destructive/5 border-destructive/20 rounded border p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-destructive/10 rounded p-1.5">
                    <Shield className="text-destructive h-3.5 w-3.5" />
                  </div>
                  <p className="text-destructive/90 text-sm font-medium">
                    {errorMessages[error] ||
                      "Ocurrió un error. Intenta de nuevo."}
                  </p>
                </div>
                <button
                  onClick={clearError}
                  className="text-destructive/60 hover:text-destructive/90 text-sm font-medium transition-colors"
                  aria-label="Cerrar mensaje de error"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {from && !emailSent && (
            <div className="bg-primary/5 border-primary/20 rounded border p-4 backdrop-blur-sm">
              <p className="text-primary/90 text-center text-sm font-medium">
                Necesitas iniciar sesión para continuar
              </p>
            </div>
          )}

          {/* Main Content */}
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-foreground text-sm font-medium"
                >
                  Correo institucional
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="usuario@unal.edu.co"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/60 h-12 rounded pr-4 pl-4 transition-all duration-200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-full rounded font-medium shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Enviando enlace...
                  </>
                ) : (
                  <>
                    <Mail />
                    Enviar enlace de acceso
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-primary/5 border-primary/20 rounded border p-5 backdrop-blur-sm">
                <div className="space-y-2 text-center">
                  <p className="text-sm">Enlace enviado a</p>
                  <p className="text-primary text-sm font-semibold">{email}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground text-xs">
                  El enlace expira en{" "}
                  <span className="font-medium">1 hora</span>
                </p>

                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailSent(false)
                    setEmail("")
                    clearError()
                  }}
                  className="border-border/50 hover:bg-muted/50 h-11 w-full rounded transition-all duration-200"
                >
                  <RotateCw />
                  Enviar otro enlace
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-border/30 border-t pt-8 text-center">
            <p className="text-muted-foreground/80 text-xs">
              Enviaremos un enlace de acceso a tu correo institucional
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
