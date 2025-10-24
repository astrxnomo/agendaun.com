"use client"

import { ArrowRight, CalendarClock } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

import { ScheduleItemActions } from "@/components/schedule/schedule-item-actions"
import { SchedulePagination } from "@/components/schedule/schedule-pagination"

import type { Schedules } from "@/lib/appwrite/types"

type SchedulesListProps = {
  schedules: Array<{
    schedule: Schedules
    canEdit: boolean
  }>
  categorySlug: string
  total: number
  totalPages: number
  currentPage: number
}

export function SchedulesList({
  schedules,
  categorySlug,
  totalPages,
  currentPage,
}: SchedulesListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())

    startTransition(() => {
      router.push(`/schedules/${categorySlug}?${params.toString()}`)
    })
  }

  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg p-12 text-center">
        <CalendarClock className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">No hay horarios disponibles</h3>
        <p className="text-muted-foreground text-sm">
          No se encontraron horarios para esta categoría en tu sede.
        </p>
      </div>
    )
  }

  return (
    <>
      <div
        className={`grid gap-6 md:grid-cols-2 xl:grid-cols-3 ${
          isPending ? "opacity-50 transition-opacity" : ""
        }`}
      >
        {schedules.map(({ schedule, canEdit }) => (
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

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <SchedulePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isPending={isPending}
          />
        </div>
      )}
    </>
  )
}
