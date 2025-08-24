import Calendar from "@/components/calendar/calendar"
import { PageHeader } from "@/components/page-header"
import { getCalendarBySlug } from "@/lib/actions/calendars.actions"

export default async function SedeCalendarPage() {
  const sedeCalendar = await getCalendarBySlug("sede-calendar")

  if (!sedeCalendar) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>No se encontró el calendario de sede.</p>
        <p className="text-muted-foreground mt-2 text-sm">
          El calendario debe ser creado desde el panel de administración.
        </p>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", href: "/calendars" },
          { label: "Sede", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Calendario de Sede</h1>
        <p className="text-muted-foreground mt-2">
          Eventos y actividades específicas de sede. Los eventos se filtran
          según tu sede configurada.
        </p>
      </div>

      <Calendar calendar={sedeCalendar} />
    </>
  )
}
