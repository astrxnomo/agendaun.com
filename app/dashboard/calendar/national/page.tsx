import NationalCalendar from "@/components/calendars/national-calendar"
import { PageHeader } from "@/components/page-header"

export default function NationalCalendarPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Calendarios", href: "/dashboard/calendar" },
          { label: "Nacional", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Calendario Nacional
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Festividades y días festivos oficiales de Colombia
          </p>
        </div>
      </div>
      <NationalCalendar userRole="user" />
    </>
  )
}
