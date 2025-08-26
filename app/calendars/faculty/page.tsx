import Calendar from "@/components/calendar/calendar"
import { PageHeader } from "@/components/page-header"

export default function Page() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", href: "/calendars" },
          { label: "Facultad", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Calendario de Facultad</h1>
        <p className="text-muted-foreground mt-2">
          Eventos y actividades específicas de facultad. Los eventos se filtran
          según tu facultad configurada.
        </p>
      </div>

      <Calendar calendarSlug="faculty-calendar" />
    </>
  )
}
