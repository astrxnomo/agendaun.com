import { Settings } from "lucide-react"

import { ConfigDialog } from "@/components/config-dialog"
import { ScheduleCategoryNotFound, SchedulesList } from "@/components/schedule"
import { ScheduleDialog } from "@/components/schedule/schedule-dialog"
import { StatusMessage } from "@/components/status-message"
import { Button } from "@/components/ui/button"
import { canEditSchedule, canEditScheduleCategory } from "@/lib/actions/users"
import { getProfile } from "@/lib/data/profiles/getProfile"
import { getSchedulesByCategory } from "@/lib/data/schedules/getSchedulesByCategory"
import { getUser } from "@/lib/data/users/getUser"
import { PageHeader } from "../page-header"

type SchedulesContentProps = {
  categorySlug: string
  currentPage: number
}

export async function SchedulesContent({
  categorySlug,
  currentPage,
}: SchedulesContentProps) {
  // Paso 1: Consultas dependientes
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

  // Paso 3: Consultar permisos de cada schedule en paralelo
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {total > 0 && (
              <p className="text-muted-foreground mt-1 text-sm">
                {total} {total === 1 ? "horario" : "horarios"} disponibles para{" "}
                {profile.sede.name}
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
