import { Suspense } from "react"

import { CalendarsList } from "@/components/calendar/calendars-list"
import { CalendarsSkeleton } from "@/components/calendar/calendars-skeleton"
import { PageHeader } from "@/components/layout/page-header"

export default function Page() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Calendarios Académicos</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona y visualiza eventos por nivel académico
        </p>
      </div>

      <Suspense fallback={<CalendarsSkeleton />}>
        <CalendarsList />
      </Suspense>
    </>
  )
}
