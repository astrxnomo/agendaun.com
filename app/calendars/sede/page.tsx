import SedeCalendar from "@/components/calendars/sede-calendar"
import { PageHeader } from "@/components/page-header"

export default function SedeCalendarPage() {
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
          Eventos y actividades específicas de tu sede universitaria
        </p>
      </div>
      <SedeCalendar userRole="user" />
    </>
  )
}
