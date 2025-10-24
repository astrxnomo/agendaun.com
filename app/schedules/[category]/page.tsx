import { ArrowRight, CalendarClock, Settings } from "lucide-react"
import Link from "next/link"

import { ConfigDialog } from "@/components/auth/config-dialog"
import { PageHeader } from "@/components/page-header"
import {
  ScheduleCategoryNotFound,
  SchedulePagination,
} from "@/components/schedule"
import { ScheduleDialog } from "@/components/schedule/schedule-dialog"
import { ScheduleItemActions } from "@/components/schedule/schedule-item-actions"
import { StatusMessage } from "@/components/status-message"
import { Button } from "@/components/ui/button"
import { canEditSchedule, canEditScheduleCategory } from "@/lib/actions/users"
import { getProfile } from "@/lib/data/profiles/getProfile"
import { getSchedulesByCategory } from "@/lib/data/schedules/getSchedulesByCategory"
import { getUser } from "@/lib/data/users/getUser"

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

  const user = await getUser()
  const profile = await getProfile(user.$id)

  if (!profile?.sede) {
    return (
      <StatusMessage
        type="warning"
        title="Completa tu información"
        description="Para acceder a estos horarios, necesitas completar la información de tu cuenta"
        button={
          <div className="flex justify-center">
            <ConfigDialog>
              <Button
                size="lg"
                className="bg-yellow-600 text-white shadow-lg hover:scale-105 hover:bg-yellow-700 hover:shadow-xl dark:bg-yellow-600 dark:hover:bg-yellow-500"
              >
                <Settings className="size-4" />
                Completar ahora
              </Button>
            </ConfigDialog>
          </div>
        }
      />
    )
  }

  const [
    { schedules, category, total, totalPages, currentPage: page },
    canEditCategory,
  ] = await Promise.all([
    getSchedulesByCategory(categorySlug, profile, currentPage),
    canEditScheduleCategory(categorySlug),
  ])

  if (!category) {
    return <ScheduleCategoryNotFound />
  }

  const schedulesWithPermissions = await Promise.all(
    schedules.map(async (schedule) => ({
      schedule,
      canEdit: await canEditSchedule(schedule),
    })),
  )

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {total > 0 && (
              <p className="text-muted-foreground mt-1 text-sm">
                {total} {total === 1 ? "horario" : "horarios"} disponibles
              </p>
            )}
          </div>

          {canEditCategory && <ScheduleDialog category={category} />}
        </div>
      </div>

      <div className="p-6 md:p-10 lg:p-20">
        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg p-12 text-center">
            <CalendarClock className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="text-lg font-semibold">
              No hay horarios disponibles
            </h3>
            <p className="text-muted-foreground text-sm">
              No se encontraron horarios para esta categoría en tu sede.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {schedulesWithPermissions.map(({ schedule, canEdit }) => (
              <div
                key={schedule.$id}
                className="bg-muted/40 hover:border-primary/30 relative flex h-full flex-col overflow-hidden rounded-xl border border-transparent transition-all duration-200 hover:shadow-xl"
              >
                <div className="flex items-start gap-4 p-6">
                  <Link
                    href={`/schedules/${categorySlug}/${schedule.$id}`}
                    className="group flex min-w-0 flex-1 items-start gap-4"
                  >
                    <span className="bg-primary/10 text-primary flex-shrink-0 rounded-lg p-3">
                      <CalendarClock className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="group-hover:text-primary truncate text-lg font-semibold transition-colors">
                          {schedule.name}
                        </h3>
                        {!canEdit && (
                          <ArrowRight className="text-muted-foreground h-4 w-4 flex-shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                        )}
                      </div>
                      {schedule.description && (
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                          {schedule.description}
                        </p>
                      )}
                    </div>
                  </Link>
                  {canEdit && (
                    <div className="flex flex-shrink-0 items-center">
                      <ScheduleItemActions schedule={schedule} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <SchedulePagination
              currentPage={page}
              totalPages={totalPages}
              category={categorySlug}
            />
          </div>
        )}
      </div>
    </>
  )
}
