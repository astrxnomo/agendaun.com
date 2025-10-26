import { Suspense } from "react"

import { LoginForm } from "@/components/login/login-form"
import { LoginSkeleton } from "@/components/login/login-skeleton"
import { PageHeader } from "@/components/page-header"

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
