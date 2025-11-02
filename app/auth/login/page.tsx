import { Suspense } from "react"

import { LoginForm } from "@/components/auth/login-form"
import { LoginSkeleton } from "@/components/auth/login-skeleton"
import { PageHeader } from "@/components/layout/page-header"

export default function LoginPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Iniciar sesión", isCurrentPage: true },
        ]}
      />

      <Suspense fallback={<LoginSkeleton />}>
        <LoginForm />
      </Suspense>
    </>
  )
}
