import FacultadCalendar from "@/components/calendars/facultad-calendar"
import { PageHeader } from "@/components/page-header"

export default function FacultadCalendarPage() {
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
          Festividades y días festivos oficiales de la facultad
        </p>
      </div>
      <FacultadCalendar editable={false} />
    </>
  )
}
