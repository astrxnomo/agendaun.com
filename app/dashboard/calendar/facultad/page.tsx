import FacultadCalendar from "@/components/calendars/facultad-calendar"
import { PageHeader } from "@/components/page-header"

export default function FacultadCalendarPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Calendarios", href: "/dashboard/calendar" },
          { label: "Facultad", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Calendario de Facultad
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Festividades y días festivos oficiales de la facultad
          </p>
        </div>
      </div>
      <FacultadCalendar editable={false} />
    </>
  )
}
