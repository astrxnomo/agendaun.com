import Calendar from "@/components/calendar/core/calendar"

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <Calendar slug={slug} />
}

export function generateStaticParams() {
  return [
    { slug: "personal" },
    { slug: "national" },
    { slug: "sede" },
    { slug: "faculty" },
    { slug: "program" },
  ]
}
