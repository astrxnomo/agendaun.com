"use client"

import { LoaderCircle, RotateCw, Shield, ShieldBan } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/contexts/auth-context"
import { createSession } from "@/lib/appwrite/auth"
import { cn } from "@/lib/utils"

import { PageHeader } from "../page-header"

type Props = {
  userId: string
  secret: string
}

export default function AuthVerify({ userId, secret }: Props) {
  const router = useRouter()
  const { refreshAuth } = useAuthContext()
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    const verifySession = async () => {
      try {
        await createSession(userId, secret)

        if (!cancelled) {
          await refreshAuth()
          toast.success("Sesión verificada correctamente")
          router.push("/calendars/my-calendar")
        }
      } catch {
        if (!cancelled) {
          setError(true)
        }
      }
    }

    void verifySession()

    return () => {
      cancelled = true
    }
  }, [userId, secret, router, refreshAuth])

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Verificación", isCurrentPage: true },
        ]}
      />

      <main className="flex min-h-[70vh] w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-5 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={cn(
                  "absolute inset-0 scale-150 rounded-full blur-xl",
                  error ? "bg-destructive/10" : "bg-emerald-500/10",
                )}
              />
              <div
                className={cn(
                  "relative rounded-2xl border bg-gradient-to-br p-6 shadow-sm",
                  error
                    ? "from-destructive/5 to-destructive/10 border-destructive/20"
                    : "animate-pulse border-emerald-500/20 from-emerald-500/5 to-emerald-500/10",
                )}
              >
                {error ? (
                  <ShieldBan className="text-destructive size-8" />
                ) : (
                  <Shield className="size-8 animate-pulse text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-foreground text-2xl font-semibold">
              {!error ? "Verificando" : "Hubo un problema"}
            </h1>
            {!error ? (
              <p className="text-muted-foreground mx-auto text-sm">
                Estamos verificando tu sesión. Espera unos segundos...
              </p>
            ) : (
              <ul className="text-muted-foreground mx-auto text-sm">
                <li>Puede que ya hayas iniciado sesión</li>
                <li>El enlace de verificación puede haber expirado</li>
                <li></li>
              </ul>
            )}
          </div>

          {!error ? (
            <div className="flex flex-col items-center space-y-3">
              <LoaderCircle className="text-primary animate-spin" />
              <div className="border-border/30 border-t pt-4 text-center">
                <p className="text-muted-foreground text-xs">
                  Si no eres redirigido automáticamente, por favor espera un
                  momento...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Button asChild variant="outline">
                <Link href="/auth/login">
                  <RotateCw />
                  Volver a iniciar sesión
                </Link>
              </Button>

              <div className="border-border/30 border-t pt-4 text-center">
                <p className="text-muted-foreground/80 text-xs">
                  Si el problema persiste, contacta al soporte
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
