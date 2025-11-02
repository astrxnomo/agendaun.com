"use client"

import { CalendarClock } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

import { SchedulePagination } from "@/components/schedule/schedules-pagination"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

import type { Schedules } from "@/lib/data/types"
import { ScheduleItem } from "./schedule-item"

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
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarClock />
          </EmptyMedia>
          <EmptyTitle>No hay horarios disponibles</EmptyTitle>
          <EmptyDescription>
            No se encontraron horarios para esta categoría en tu sede.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3",
          isPending && "pointer-events-none opacity-50",
        )}
      >
        {schedules.map(({ schedule, canEdit }) => (
          <ScheduleItem
            key={schedule.$id}
            schedule={schedule}
            categorySlug={categorySlug}
            canEdit={canEdit}
          />
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
