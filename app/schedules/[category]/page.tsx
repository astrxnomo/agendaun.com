import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"
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
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Horarios", href: "/schedules" },
          { label: "...", isCurrentPage: true },
        ]}
      />

      <Suspense fallback={<SchedulesSkeleton />}>
        <SchedulesContent
          categorySlug={categorySlug}
          currentPage={currentPage}
        />
      </Suspense>
    </>
  )
}
