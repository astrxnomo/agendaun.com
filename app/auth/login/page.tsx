import { redirect } from "next/navigation"

import LoginForm from "@/components/auth/login-form"
import { getUser } from "@/lib/auth"

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string
    from?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getUser()

  // Si ya está autenticado, redirigir
  if (user) {
    const params = await searchParams
    const redirectTo = params?.from || "/"
    redirect(redirectTo)
  }

  // Resolver searchParams para pasarlos al componente cliente
  const resolvedSearchParams = await searchParams

  return <LoginForm searchParams={resolvedSearchParams} />
}
