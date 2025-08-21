import { CalendarDataProvider } from "@/components/calendar/calendar-data-context"
import UniversalCalendar from "@/components/calendar/universal-calendar"
import { PageHeader } from "@/components/page-header"
import { getPersonalCalendarData } from "@/lib/actions/calendars.actions"

export default async function MyCalendarPage() {
  const data = await getPersonalCalendarData()

  if (!data) {
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
      <CalendarDataProvider calendar={data.calendar}>
        <UniversalCalendar
          calendar={data.calendar}
          title="Mi Calendario"
          showEditButton={true}
        />
      </CalendarDataProvider>
    </>
  )
}
