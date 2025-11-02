import Calendar from "@/components/calendar/core/calendar"
import type { CalendarViews } from "@/lib/data/types"

export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ view?: string }>
}) {
  const { slug } = await params
  const { view } = await searchParams

  return <Calendar slug={slug} view={view as CalendarViews} />
}

export function generateStaticParams() {
  return [{ slug: "personal" }, { slug: "unal" }]
}
