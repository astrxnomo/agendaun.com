import { House, Lock } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import { AuthCard, AuthContent, AuthIcon } from "../ui/auth-card"

export function Unauthorized() {
  return (
    <AuthCard>
      <AuthIcon animate>
        <Lock className="size-8" />
      </AuthIcon>

      <AuthContent
        title="Acceso restringido"
        description="No puedes acceder a esta página"
      />

      <Button size="lg" variant="outline" asChild>
        <Link href="/">
          <House />
          Inicio
        </Link>
      </Button>
    </AuthCard>
  )
}
