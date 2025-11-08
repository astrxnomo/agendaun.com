"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { PageHeader } from "@/components/layout/page-header"
import { useAuthContext } from "@/contexts/auth-context"
import { scheduleEditMode } from "@/lib/actions/users"
import { getScheduleById } from "@/lib/data/schedules/getScheduleById"
import { getScheduleEvents } from "@/lib/data/schedules/getScheduleEvents"

import type { ScheduleEvents, Schedules } from "@/lib/data/types"
import { ScheduleNotFound } from "./not-found"
import { ScheduleHeader } from "./schedule-header"
import { SetupSchedule } from "./setup-schedule"
import { ScheduleSkeleton } from "./skeleton"

export function Schedule({ scheduleId }: { scheduleId: string }) {
  const { user, isLoading: authLoading } = useAuthContext()
  const [schedule, setSchedule] = useState<Schedules | null>(null)
  const [events, setEvents] = useState<ScheduleEvents[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [canEdit, setCanEdit] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const newEventTriggerRef = useRef<(() => void) | null>(null)

  const router = useRouter()

  const toggleEditMode = () => setEditMode(!editMode)

  const handleNewEventClick = () => {
    if (newEventTriggerRef.current) {
      newEventTriggerRef.current()
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const scheduleResult = await getScheduleById(scheduleId)

        if (!scheduleResult) {
          return
        }

        setSchedule(scheduleResult)

        const [eventsResult, canEditResult] = await Promise.all([
          getScheduleEvents(scheduleResult),
          scheduleEditMode(scheduleResult),
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

    if (!user && !authLoading) {
      router.push(
        "/auth/login?message=Debes iniciar sesión para acceder a esta página",
      )
      return
    }

    if (user) {
      void fetchData()
    }
  }, [user, authLoading, scheduleId, router])

  if (authLoading || isLoading) return <ScheduleSkeleton />

  if (!user) {
    return null
  }

  if (!schedule) return <ScheduleNotFound />

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
        onNewEvent={handleNewEventClick}
      />
      <SetupSchedule
        schedule={schedule}
        events={events}
        onEventsUpdate={setEvents}
        editable={editMode}
        canEdit={canEdit}
        newEventTriggerRef={newEventTriggerRef}
      />
    </>
  )
}
