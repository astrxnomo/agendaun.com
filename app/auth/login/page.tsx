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

  if (user) {
    const params = await searchParams
    const redirectTo = params?.from || "/my-calendar"
    redirect(redirectTo)
  }

  const resolvedSearchParams = await searchParams

  return <LoginForm searchParams={resolvedSearchParams} />
}
