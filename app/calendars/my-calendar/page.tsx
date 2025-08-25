import Calendar from "@/components/calendar/calendar"
import { PageHeader } from "@/components/page-header"
import { getPersonalCalendarData } from "@/lib/actions/calendars.actions"

export default async function Page() {
  const calendar = await getPersonalCalendarData()

  if (!calendar || "type" in calendar) {
    return (
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Mi Calendario</h1>
        <p className="text-muted-foreground mt-2">
          Por favor, inicia sesión para acceder a tu calendario personal.
        </p>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Mi calendario", isCurrentPage: true },
        ]}
      />
      <Calendar calendar={calendar} />
    </>
  )
}
