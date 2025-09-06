import Calendar from "@/components/calendar/calendar"
import { PageHeader } from "@/components/page-header"

export default async function Page() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Mi calendario", isCurrentPage: true },
        ]}
      />
      <Calendar slug="personal" />
    </>
  )
}
