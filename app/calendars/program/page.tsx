import Calendar from "@/components/calendar/calendar"
import { PageHeader } from "@/components/page-header"
import { getCalendarBySlug } from "@/lib/actions/calendars.actions"

export default async function Page() {
  const calendar = await getCalendarBySlug("program-calendar")

  if (!calendar || "type" in calendar) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>No se encontró el calendario de programa.</p>
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
          { label: "Programa", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Calendario de Programa</h1>
        <p className="text-muted-foreground mt-2">
          Eventos y actividades específicas de programa académico. Los eventos
          se filtran según tu programa configurado.
        </p>
      </div>

      <Calendar calendar={calendar} />
    </>
  )
}
