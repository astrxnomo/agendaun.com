import FacultadCalendar from "@/components/calendars/facultad-calendar"
import { PageHeader } from "@/components/page-header"

export default function FacultadCalendarPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Calendario", href: "/dashboard/calendar" },
          { label: "Facultad", isCurrentPage: true },
        ]}
      />
      <div className="flex h-full flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <h1 className="text-lg font-semibold">Calendario de Facultad</h1>
        </header>
        <div className="flex-1">
          <FacultadCalendar editable={false} />
        </div>
      </div>
    </>
  )
}
