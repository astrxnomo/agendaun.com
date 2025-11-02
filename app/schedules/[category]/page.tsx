import { CategorySchedules } from "@/components/schedule/category/category-schedules"
import { SchedulesSkeleton } from "@/components/schedule/schedules-skeleton"
import { Suspense } from "react"

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
      <CategorySchedules
        categorySlug={categorySlug}
        currentPage={currentPage}
      />
    </Suspense>
  )
}
