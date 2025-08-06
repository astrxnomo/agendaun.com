import SedeCalendar from "@/components/calendars/sede-calendar"
import { PageHeader } from "@/components/page-header"

export default function SedeCalendarPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Calendarios", href: "/dashboard/calendar" },
          { label: "Sede", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Calendario de Sede
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Eventos y actividades específicas de tu sede universitaria
          </p>
        </div>
      </div>
      <SedeCalendar userRole="user" />
    </>
  )
}
