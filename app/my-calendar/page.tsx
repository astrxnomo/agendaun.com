import { AuthRequired } from "@/components/auth/auth-required"
import PersonalCalendar from "@/components/calendars/personal-calendar"
import { getUser } from "@/lib/auth"

export default async function Page() {
  const user = await getUser()

  if (!user) {
    return <AuthRequired />
  }

  return <PersonalCalendar _user={user} />
}
