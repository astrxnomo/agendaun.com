import ProgramaCalendar from "@/components/calendars/programa-calendar"
import { PageHeader } from "@/components/page-header"

export default function ProgramaCalendarPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", href: "/calendar" },
          { label: "Programa", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Calendario de Programa</h1>
        <p className="text-muted-foreground mt-2">
          Eventos académicos específicos de tu programa de estudios
        </p>
      </div>
      <ProgramaCalendar userRole="user" />
    </>
  )
}
