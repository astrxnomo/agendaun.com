import NationalCalendar from "@/components/calendars/national-calendar"
import { PageHeader } from "@/components/page-header"
import { getEtiquettes } from "@/lib/actions/etiquettes.actions"
import { getEvents } from "@/lib/actions/events.actions"

export default async function NationalCalendarPage() {
  const events = await getEvents("national")
  const etiquettes = await getEtiquettes("national")

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", href: "/calendars" },
          { label: "Nacional", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Calendario Nacional</h1>
        <p className="text-muted-foreground mt-2">
          Festividades y días festivos oficiales de Colombia
        </p>
      </div>
      <NationalCalendar
        userRole="user"
        events={events}
        etiquettes={etiquettes}
      />
    </>
  )
}
