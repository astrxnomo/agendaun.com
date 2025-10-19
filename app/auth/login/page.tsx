"use client"

import { Loader2, Lock, Mail, MailCheck, RotateCw, ShieldX } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendMagicLink } from "@/lib/appwrite/auth"

import type React from "react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    const message = searchParams.get("message")
    const type = searchParams.get("type") || "info"

    if (!message) return

    const isError = type === "error"

    toast.custom(
      () => (
        <div className="bg-card border-border animate-in fade-in slide-in-from-top-2 pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg border p-4 shadow-md">
          <div
            className={`${isError ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"} flex size-9 shrink-0 items-center justify-center rounded`}
          >
            {isError ? (
              <ShieldX className="size-4.5" />
            ) : (
              <Lock className="size-4.5" />
            )}
          </div>
          <div className="flex-1 space-y-0.5">
            <p className="text-card-foreground text-sm leading-none font-medium">
              {isError ? "Error de verificación" : "Autenticación requerida"}
            </p>
            <p className="text-muted-foreground text-xs">{message}</p>
          </div>
        </div>
      ),
      {
        duration: 15000,
      },
    )
  }, [searchParams])

  const sendMagicLinkAction = async () => {
    const email = `${username}@unal.edu.co`
    await sendMagicLink(email)
    setEmailSent(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      return toast.error("Por favor ingresa tu usuario")
    }

    setIsLoading(true)

    toast.promise(sendMagicLinkAction(), {
      loading: "Enviando enlace...",
      success: "¡Enlace enviado! Revisa tu correo electrónico",
      error: (error: Error) =>
        error.message || "Error enviando el enlace de acceso",
    })

    setIsLoading(false)
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
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-primary/10 absolute inset-0 scale-150 rounded-full blur-xl"></div>
                <div
                  className={`from-primary/5 to-primary/10 border-primary/10 relative rounded-2xl border bg-gradient-to-br p-6 shadow-sm ${emailSent ? "animate-pulse" : ""}`}
                >
                  {emailSent ? (
                    <MailCheck className="text-primary size-8" />
                  ) : (
                    <Mail className="text-primary size-8" />
                  )}
                </div>
              </div>
            </div>

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
                    placeholder="usuario"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/60 h-12 rounded px-4 pe-32 transition-all duration-200"
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                    @unal.edu.co
                  </span>
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
              <div className="bg-primary/5 border-primary/20 rounded border p-5 backdrop-blur-sm">
                <div className="space-y-2 text-center">
                  <p className="text-sm">Enlace enviado a</p>
                  <p className="text-primary text-sm font-semibold">
                    {username}@unal.edu.co
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-center">
                <p className="text-muted-foreground text-xs">
                  El enlace expira en{" "}
                  <span className="font-medium">1 hora</span>
                </p>

                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailSent(false)
                    setUsername("")
                  }}
                  className="border-border/50 hover:bg-muted/50 h-11 w-full rounded transition-all duration-200"
                >
                  <RotateCw />
                  Enviar otro enlace
                </Button>
              </div>
            </div>
          )}

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
