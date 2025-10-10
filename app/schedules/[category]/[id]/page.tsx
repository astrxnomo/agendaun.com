import { Schedule } from "@/components/schedule/schedule"

type Props = {
  params: Promise<{ category: string; id: string }>
}

export default async function SchedulePage({ params }: Props) {
  const { id } = await params

  return <Schedule scheduleId={id} />
}
