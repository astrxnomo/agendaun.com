import NationalCalendar from "@/components/calendars/national-calendar"
import { PageHeader } from "@/components/page-header"
import { getOrCreateNationalCalendar } from "@/lib/actions/calendars.actions"
import { getEtiquettes } from "@/lib/actions/etiquettes.actions"
import { getEvents } from "@/lib/actions/events.actions"

export default async function NationalCalendarPage() {
  // Obtener o crear el calendario nacional
  const nationalCalendar = await getOrCreateNationalCalendar()

  if (!nationalCalendar) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>No se pudo cargar el calendario nacional.</p>
      </div>
    )
  }

  const events = await getEvents(nationalCalendar.$id)
  const etiquettes = await getEtiquettes(nationalCalendar.$id)

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
        calendar={nationalCalendar}
        events={events}
        etiquettes={etiquettes}
      />
    </>
  )
}
