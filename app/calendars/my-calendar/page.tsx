import PersonalCalendar from "@/components/calendars/personal-calendar"
import { PageHeader } from "@/components/page-header"
import { getPersonalCalendarData } from "@/lib/actions/personal-calendar.actions"

export default async function MyCalendarPage() {
  const data = await getPersonalCalendarData()

  if (!data) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            { label: "Inicio", href: "/" },
            { label: "Calendarios", href: "/calendars" },
            { label: "Mi Calendario", isCurrentPage: true },
          ]}
        />
        <div className="border-b p-6">
          <h1 className="text-3xl font-bold">Mi Calendario</h1>
          <p className="text-muted-foreground mt-2">
            Por favor, inicia sesión para acceder a tu calendario personal.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", href: "/calendars" },
          { label: "Mi Calendario", isCurrentPage: true },
        ]}
      />
      <PersonalCalendar
        events={data.events}
        etiquettes={data.etiquettes}
        calendar={data.calendar}
      />
    </>
  )
}
