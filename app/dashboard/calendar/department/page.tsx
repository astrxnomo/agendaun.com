import DepartmentCalendar from "@/components/calendars/department-calendar"

export default function DepartmentCalendarPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Calendario Departamental
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Eventos y actividades académicas del departamento
        </p>
      </div>

      <DepartmentCalendar userRole="moderator" />
    </div>
  )
}
