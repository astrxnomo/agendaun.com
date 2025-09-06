import Calendar from "@/components/calendar/calendar"
import { PageHeader } from "@/components/page-header"

export default function Page() {
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

      <Calendar slug="program-calendar" />
    </>
  )
}
