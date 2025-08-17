import PersonalCalendar from "@/components/calendars/personal-calendar"
import { getUser } from "@/lib/appwrite/auth"

export default async function Page() {
  const user = await getUser()

  return <PersonalCalendar _user={user} />
}
