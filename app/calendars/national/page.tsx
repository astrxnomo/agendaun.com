import { Suspense } from "react"

import Calendar from "@/components/calendar/calendar"
import { PageHeader } from "@/components/page-header"
import { CalendarSkeleton } from "@/components/skeletons/calendar-loading"
import { getCalendarBySlug } from "@/lib/actions/calendars.actions"

export default async function NationalCalendarPage() {
  const nationalCalendar = await getCalendarBySlug("national-calendar")

  if (!nationalCalendar) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>No se encontró el calendario nacional.</p>
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
          { label: "Nacional", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Calendario Nacional</h1>
        <p className="text-muted-foreground mt-2">
          Festividades y días festivos oficiales de Colombia
        </p>
      </div>

      <Suspense fallback={<CalendarSkeleton />}>
        <Calendar
          calendar={nationalCalendar}
          title="Calendario Nacional"
          showEditButton={true}
        />
      </Suspense>
    </>
  )
}
