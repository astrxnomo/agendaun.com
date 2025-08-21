import { Suspense } from "react"

import UniversalCalendar from "@/components/calendar/universal-calendar"
import { PageHeader } from "@/components/page-header"
import { CalendarSkeleton } from "@/components/skeletons/calendar-loading"
import { getCalendarBySlug } from "@/lib/actions/calendars.actions"

export default async function FacultadCalendarPage() {
  // Obtener el calendario único de facultad
  const facultadCalendar = await getCalendarBySlug("facultad-calendar")

  if (!facultadCalendar) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>No se encontró el calendario de facultad.</p>
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

      <Suspense fallback={<CalendarSkeleton />}>
        <UniversalCalendar
          calendar={facultadCalendar}
          title="Calendario de Facultad"
          showEditButton={true}
        />
      </Suspense>
    </>
  )
}
