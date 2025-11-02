import { Suspense } from "react"

import { PageHeader } from "@/components/layout/page-header"

import { SchedulesCategoriesSkeleton } from "../../components/schedule/category/categories-skeleton"
import { SchedulesCategories } from "../../components/schedule/category/schedules-categories"

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Horarios", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Horarios</h1>
        <p className="text-muted-foreground mt-2">
          Accede a todos los horarios de servicios universitarios
        </p>
      </div>

      <Suspense fallback={<SchedulesCategoriesSkeleton />}>
        <SchedulesCategories />
      </Suspense>
    </>
  )
}
