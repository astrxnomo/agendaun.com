import { canAdminScheduleCategory, canEditSchedule } from "@/lib/actions/users"
import { getProfile } from "@/lib/data/profiles/getProfile"
import { getSchedulesByCategory } from "@/lib/data/schedules/getSchedulesByCategory"
import { User } from "@/lib/data/types"
import { PageHeader } from "../../layout/page-header"
import { ScheduleDialog } from "../schedule-dialog"
import { SchedulesList } from "../schedules-list"
import { ScheduleCategoryNotFound } from "./category-not-found"

type SchedulesContentProps = {
  categorySlug: string
  currentPage: number
  user?: User
}

export async function CategorySchedules({
  categorySlug,
  currentPage,
  user,
}: SchedulesContentProps) {
  if (!user) {
    return <ScheduleCategoryNotFound />
  }

  const profile = await getProfile(user.$id)

  const [
    { schedules, category, total, totalPages, currentPage: page },
    canEditCategory,
  ] = await Promise.all([
    getSchedulesByCategory(categorySlug, profile, currentPage),
    canAdminScheduleCategory(categorySlug),
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
          {
            label: category.name,
            isCurrentPage: true,
          },
        ]}
      />
      <div className="border-b p-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {total > 0 && (
              <p className="text-muted-foreground mt-1 text-sm">
                {total} {total === 1 ? "horario" : "horarios"} disponible
                {total === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {canEditCategory && <ScheduleDialog category={category} />}
        </div>
      </div>

      <div className="p-6 md:p-10 lg:p-20">
        <SchedulesList
          schedules={schedulesWithPermissions}
          categorySlug={categorySlug}
          total={total}
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </>
  )
}
