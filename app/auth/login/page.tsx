import { redirect } from "next/navigation"

import LoginForm from "@/components/auth/login-form"
import { getUser } from "@/lib/auth"

export default async function LoginPage() {
  const user = await getUser()

  if (user) {
    redirect("/my-calendar")
  }

  return <LoginForm />
}
