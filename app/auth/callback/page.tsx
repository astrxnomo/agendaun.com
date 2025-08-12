"use client"

import { Loader2, ShieldCheck, ShieldX } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { AuthService } from "@/lib/auth"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  )
  const [message, setMessage] = useState("")
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return

    const handleCallback = async () => {
      try {
        hasProcessed.current = true

        const userId = searchParams.get("userId")
        const secret = searchParams.get("secret")

        if (!userId || !secret) {
          throw new Error("Parámetros de autenticación faltantes")
        }

        const existingSession = await AuthService.getSession()

        if (existingSession) {
          await refreshUser()
          setStatus("success")
          setMessage("¡Ya estás autenticado! Redirigiendo...")
        } else {
          await AuthService.completeMagicLogin(userId, secret)
          await refreshUser()
          setStatus("success")
          setMessage("¡Autenticación exitosa! Redirigiendo...")
        }

        window.setTimeout(() => {
          router.push("/my-calendar")
        }, 1500)
      } catch (unknownError) {
        const errorMessage = "Error en la autenticación"
        if (unknownError instanceof Error) {
        }

        if (/session|sesión/i.test(errorMessage)) {
          try {
            await refreshUser()
            setStatus("success")
            setMessage("¡Ya estás autenticado! Redirigiendo...")
            window.setTimeout(() => {
              router.push("/my-calendar")
            }, 1500)
            return
          } catch (refreshError) {
            console.error("Error refreshing user:", refreshError)
          }
        }

        setStatus("error")
        setMessage(errorMessage)

        window.setTimeout(() => {
          router.push("/")
        }, 3000)
      }
    }

    void handleCallback()
  }, [refreshUser, router, searchParams])

  return (
    <div className="flex items-center justify-center px-6 py-40">
      <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verificando tu acceso
          </h1>
          <p className="text-muted-foreground text-sm">
            Estamos procesando tu enlace. Este paso puede tardar unos segundos.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          {status === "loading" && (
            <>
              <div className="bg-primary/10 rounded-full p-3">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
              <p className="text-base font-medium">
                Completando autenticación…
              </p>
              <p className="text-muted-foreground text-sm">
                No cierres esta ventana.
              </p>
              <Progress
                value={66}
                className="mt-2 w-full"
                aria-label="Progreso de verificación"
              />
            </>
          )}

          {status === "success" && (
            <>
              <div className="bg-primary/10 rounded-full p-3">
                <ShieldCheck className="text-primary h-8 w-8" />
              </div>
              <p className="text-primary text-base font-medium">{message}</p>
              <p className="text-muted-foreground text-sm">
                Te llevaremos a tu calendario automáticamente.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full bg-red-500/10 p-3">
                <ShieldX className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-base font-medium text-red-600 dark:text-red-400">
                {message}
              </p>
              <p className="text-muted-foreground text-sm">
                Serás redirigido al inicio en unos segundos…
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
