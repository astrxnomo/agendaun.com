import { notFound } from "next/navigation"

import { PageHeader } from "@/components/page-header"
import { ScheduleView } from "@/components/schedule/schedule-view"
import { getScheduleEvents } from "@/lib/actions/schedule/events.actions"
import {
  getCategoryBySlug,
  getScheduleById,
} from "@/lib/actions/schedule/schedules.actions"

type Props = {
  params: Promise<{ category: string; id: string }>
}

export default async function SchedulePage({ params }: Props) {
  const { category: categorySlug, id } = await params

  // Get category info for breadcrumbs
  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  const schedule = await getScheduleById(id)

  if (!schedule) {
    notFound()
  }

  const events = await getScheduleEvents(schedule.$id)

  // Transform schedule events to the format expected by ScheduleView
  const transformedEvents = events.map((event) => ({
    $id: event.$id,
    title: event.title,
    description: event.description || undefined,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    location: event.location || undefined,
  }))

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Horarios", href: "/schedules" },
    { label: category.name, href: `/schedules/${categorySlug}` },
    { label: schedule.name || "Horario", isCurrentPage: true },
  ]

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">{schedule.name}</h1>
        <div className="text-muted-foreground mt-2 space-y-1">
          <p>
            {schedule.program?.name} - {schedule.faculty?.name}
          </p>
          <p className="text-sm">Sede: {schedule.sede?.name}</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        <ScheduleView events={transformedEvents} />
      </div>
    </>
  )
}
