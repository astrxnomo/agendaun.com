import { Suspense } from "react"

import { SchedulesContent } from "@/components/schedule/schedules-content"
import { SchedulesSkeleton } from "@/components/schedule/schedules-skeleton"

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function ScheduleCategoryPage({
  params,
  searchParams,
}: Props) {
  const { category: categorySlug } = await params
  const { page: pageParam } = await searchParams

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1

  return (
    <Suspense fallback={<SchedulesSkeleton />}>
      <SchedulesContent categorySlug={categorySlug} currentPage={currentPage} />
    </Suspense>
  )
}
