import { CategorySchedules } from "@/components/schedule/category/category-schedules"
import { SchedulesSkeleton } from "@/components/schedule/schedules-skeleton"
import { getOptionalUser } from "@/lib/data/users/getUser"
import { redirect } from "next/navigation"
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

  const currentPage = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1

  const user = await getOptionalUser()

  if (!user) {
    redirect(
      "/auth/login?message=Debes iniciar sesión para acceder a esta página",
    )
  }

  return (
    <Suspense fallback={<SchedulesSkeleton />}>
      <CategorySchedules
        categorySlug={categorySlug}
        currentPage={currentPage}
        user={user}
      />
    </Suspense>
  )
}
