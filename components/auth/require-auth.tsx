import { Lock, LogIn } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import { AuthCard, AuthContent, AuthFooter, AuthIcon } from "../ui/auth-card"

export function RequireAuth() {
  return (
    <AuthCard>
      <div className="space-y-6">
        <AuthIcon animate>
          <Lock className="size-8" />
        </AuthIcon>
        <AuthContent
          title="Acceso requerido"
          description="Para acceder a esta página necesitas iniciar sesión"
        />
      </div>

      <div className="space-y-6">
        <Button size="lg" asChild>
          <Link href="/auth/login">
            <LogIn />
            Iniciar sesión
          </Link>
        </Button>

        <AuthFooter>
          Usa tu correo institucional{" "}
          <span className="text-muted-foreground font-medium">
            (@unal.edu.co)
          </span>{" "}
          para acceder
        </AuthFooter>
      </div>
    </AuthCard>
  )
}
