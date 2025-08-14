import { redirect } from "next/navigation"

import PersonalCalendar from "@/components/calendars/personal-calendar"
import { getUser } from "@/lib/auth"

export default async function Page() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/unauthorized")
  }

  return <PersonalCalendar _user={user} />
}
