import NationalCalendar from "@/components/calendars/national-calendar"

export default function NationalCalendarPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Calendario Nacional
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Festividades y días festivos oficiales de Colombia
        </p>
      </div>

      <NationalCalendar userRole="user" />
    </div>
  )
}
