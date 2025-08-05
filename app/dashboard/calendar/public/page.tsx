import PublicCalendar from "@/components/calendars/public-calendar"

export default function PublicCalendarPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Calendario Público
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Eventos públicos abiertos a toda la comunidad universitaria
        </p>
      </div>

      <PublicCalendar userRole="user" />
    </div>
  )
}
