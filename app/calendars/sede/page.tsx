import { Suspense } from "react"

import { CalendarDataProvider } from "@/components/calendar/calendar-data-context"
import UniversalCalendar from "@/components/calendar/universal-calendar"
import { PageHeader } from "@/components/page-header"
import { CalendarSkeleton } from "@/components/skeletons/calendar-loading"
import { getSedeCalendar } from "@/lib/actions/calendars.actions"

export default async function SedeCalendarPage() {
  // Obtener el calendario único de sede
  const sedeCalendar = await getSedeCalendar()

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

      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarDataProvider calendar={sedeCalendar}>
          <UniversalCalendar
            calendar={sedeCalendar}
            title="Calendario de Sede"
            showEditButton={true}
          />
        </CalendarDataProvider>
      </Suspense>
    </>
  )
}
