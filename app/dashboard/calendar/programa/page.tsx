import ProgramaCalendar from "@/components/calendars/programa-calendar"
import { PageHeader } from "@/components/page-header"

export default function ProgramaCalendarPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Calendario", href: "/dashboard/calendar" },
          { label: "Programa", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Calendario de Programa
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Eventos académicos específicos de tu programa de estudios
          </p>
        </div>
      </div>
      <ProgramaCalendar userRole="user" />
    </>
  )
}
