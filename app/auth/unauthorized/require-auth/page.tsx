import { type Metadata } from "next"

import { RequireAuth } from "@/components/auth/require-auth"
import { PageHeader } from "@/components/page-header"

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
      <RequireAuth />
    </>
  )
}
