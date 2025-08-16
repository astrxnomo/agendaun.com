import NationalCalendar from "@/components/calendars/national-calendar"
import { PageHeader } from "@/components/page-header"
import { getCalendarBySlug } from "@/lib/data/calendars/get-calendar"
import { getEtiquettesByCalendarSlug } from "@/lib/data/etiquettes/get-etiquettes"
import { getEventsByCalendarSlug } from "@/lib/data/events/get-events"
import { type Calendars, type Etiquettes, type Events } from "@/types/db"

export default async function NationalCalendarPage() {
  const calendar: Calendars = await getCalendarBySlug("national")
  const events: Events[] = await getEventsByCalendarSlug("national")
  const etiquettes: Etiquettes[] = await getEtiquettesByCalendarSlug("national")

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
        calendar={calendar}
        userRole="user"
        events={events}
        etiquettes={etiquettes}
      />
    </>
  )
}
