/**
 * @fileoverview export function Schedule({ scheduleId }: ScheduleProps) {
  const [schedule, setSchedule] = useState<Schedules | null>(null)
  const [events, setEvents] = useState<ScheduleEvents[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [canEdit, setCanEdit] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const toggleEditMode = () => setEditMode(!editMode)ule Component - Main Schedule Container
 * @descri        ]}
      />
      <ScheduleHeader
        schedule={schedule}
        editMode={editMode}
        canEdit={canEdit}
        onToggleEditMode={toggleEditMode}
      />
      <SetupSchedule
        schedule={schedule}
        events={events}
        onEventsUpdate={setEvents}
        editable={editMode}
        canEdit={canEdit}
      />mponente principal que obtiene datos y orquesta el horario
 * @category UI Components - Schedule
 */

"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { getScheduleEvents } from "@/lib/actions/schedule/events.actions"
import { getScheduleById } from "@/lib/actions/schedule/schedules.actions"
import { canEditSchedule } from "@/lib/actions/users.actions"

import { ScheduleError } from "./schedule-error"
import { ScheduleHeader } from "./schedule-header"
import { ScheduleSkeleton } from "./schedule-skeleton"
import { SetupSchedule } from "./setup-schedule"

import type { ScheduleEvents, Schedules } from "@/types"

export function Schedule({ scheduleId }: { scheduleId: string }) {
  const [schedule, setSchedule] = useState<Schedules | null>(null)
  const [events, setEvents] = useState<ScheduleEvents[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [canEdit, setCanEdit] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const toggleEditMode = () => setEditMode(!editMode)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const scheduleResult = await getScheduleById(scheduleId)

        if (!scheduleResult) {
          toast.error("Horario no encontrado")
          return
        }

        setSchedule(scheduleResult)

        const [eventsResult, canEditResult] = await Promise.all([
          getScheduleEvents(scheduleResult),
          canEditSchedule(scheduleResult),
        ])

        setEvents(eventsResult)
        setCanEdit(canEditResult)
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al cargar los datos del horario"
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [scheduleId])

  if (isLoading) return <ScheduleSkeleton />

  if (!schedule) return <ScheduleError />

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Horarios", href: "/schedules" },
          {
            label: schedule.category.name,
            href: `/schedules/${schedule.category.slug}`,
          },
          { label: schedule.name || "Horario", isCurrentPage: true },
        ]}
      />
      <ScheduleHeader
        schedule={schedule}
        editMode={editMode}
        canEdit={canEdit}
        onToggleEditMode={toggleEditMode}
      />
      <SetupSchedule
        schedule={schedule}
        events={events}
        onEventsUpdate={setEvents}
        editable={editMode}
        canEdit={canEdit}
      />
    </>
  )
}
