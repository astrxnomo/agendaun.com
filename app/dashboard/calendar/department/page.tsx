import DepartmentCalendar from "@/components/calendars/department-calendar"
import { PageHeader } from "@/components/page-header"

export default function DepartmentCalendarPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Calendario", href: "/dashboard/calendar" },
          { label: "Departamental", isCurrentPage: true },
        ]}
      />
      <div className="mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Calendario Departamental
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Eventos y actividades académicas del departamento
          </p>
        </div>
      </div>
      <DepartmentCalendar userRole="moderator" />
    </>
  )
}
