import { ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHeader } from "@/components/page-header"
import {
  getCategoryBySlug,
  getSchedulesByCategory,
} from "@/lib/actions/schedule/schedules.actions"

type Props = {
  params: Promise<{ category: string }>
}

export default async function ScheduleCategoryPage({ params }: Props) {
  const { category: categorySlug } = await params

  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  const schedules = await getSchedulesByCategory(category.$id)

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Horarios", href: "/schedules" },
          { label: category.name, isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground mt-2">
          Todos los horarios de {category.name.toLowerCase()}
        </p>
      </div>

      <div className="p-6 md:p-10 lg:p-20">
        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Clock className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="text-lg font-semibold">
              No hay horarios disponibles
            </h3>
            <p className="text-muted-foreground text-sm">
              No se encontraron horarios para esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {schedules.map((schedule) => (
              <Link
                key={schedule.$id}
                href={`/schedules/${categorySlug}/${schedule.$id}`}
                className="group bg-muted/40 hover:border-primary/30 hover:bg-muted/60 relative overflow-hidden rounded-xl border border-transparent p-6 transition-all duration-200 hover:shadow-xl"
              >
                <div className="relative flex items-start gap-4">
                  <span className="bg-primary/10 text-primary rounded-lg p-3">
                    <Clock className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                      {schedule.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {schedule.program?.name} - {schedule.faculty?.name}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Sede: {schedule.sede?.name}
                    </p>
                  </span>
                  <ArrowRight className="text-muted-foreground h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
