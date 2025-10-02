import { notFound } from "next/navigation"

import { PageHeader } from "@/components/page-header"
import { ScheduleView } from "@/components/schedule/schedule-view"
import { getScheduleEvents } from "@/lib/actions/schedule/events.actions"
import { getScheduleById } from "@/lib/actions/schedule/schedules.actions"

type Props = {
  params: Promise<{ category: string; id: string }>
}

export default async function SchedulePage({ params }: Props) {
  const { id } = await params

  const schedule = await getScheduleById(id)

  if (!schedule) {
    notFound()
  }
  const events = await getScheduleEvents(schedule)

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Horarios", href: "/schedules" },
    {
      label: schedule.category.name,
      href: `/schedules/${schedule.category.slug}`,
    },
    { label: schedule.name || "Horario", isCurrentPage: true },
  ]

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="p-6">
        <h1 className="text-3xl font-bold">{schedule.name}</h1>
        <div className="text-muted-foreground mt-2 space-y-1">
          <p>
            {schedule.program?.name} - {schedule.faculty?.name}
          </p>
          <p className="text-sm">Sede: {schedule.sede?.name}</p>
        </div>
      </div>

      <ScheduleView events={events} />
    </>
  )
}
