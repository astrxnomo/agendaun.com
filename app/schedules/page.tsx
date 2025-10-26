import { Suspense } from "react"

import { PageHeader } from "@/components/page-header"

import { SchedulesCategoriesContent } from "../../components/schedule/schedules-categories-content"
import { SchedulesCategoriesSkeleton } from "../../components/schedule/schedules-categories-skeleton"

export default function SchedulesCategoriesPage() {
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
        <SchedulesCategoriesContent />
      </Suspense>
    </>
  )
}
