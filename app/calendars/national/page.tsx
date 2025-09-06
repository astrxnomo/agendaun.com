import Calendar from "@/components/calendar/calendar"
import { PageHeader } from "@/components/page-header"

export default function Page() {
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

      <Calendar slug="national-calendar" />
    </>
  )
}
