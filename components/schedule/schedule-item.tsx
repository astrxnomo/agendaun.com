import { CalendarClock } from "lucide-react"
import Link from "next/link"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Schedules } from "@/lib/data/types"
import { ScheduleItemActions } from "./core/schedule-item-actions"

interface ScheduleItemProps {
  schedule: Schedules
  categorySlug: string
  canEdit: boolean
}
export function ScheduleItem({
  schedule,
  categorySlug,
  canEdit,
}: ScheduleItemProps) {
  const scheduleUrl = `/schedules/${categorySlug}/${schedule.$id}`

  if (!canEdit) {
    // Versión completa como enlace
    return (
      <Item className="bg-muted/40" asChild>
        <Link href={scheduleUrl} aria-label={`Ver horario ${schedule.name}`}>
          <ItemMedia>
            <div className="bg-primary/10 text-primary rounded p-3">
              <CalendarClock className="h-6 w-6" />
            </div>
          </ItemMedia>

          <ItemContent>
            <ItemTitle className="text-lg font-semibold">
              {schedule.name}
            </ItemTitle>
            {schedule.description && (
              <ItemDescription className="line-clamp-2 leading-tight">
                {schedule.description}
              </ItemDescription>
            )}
          </ItemContent>
        </Link>
      </Item>
    )
  }

  return (
    <Item className="bg-muted/40 hover:border-primary/30">
      <ItemMedia>
        <div className="bg-primary/10 text-primary rounded p-3">
          <CalendarClock className="h-6 w-6" />
        </div>
      </ItemMedia>

      <ItemContent>
        <Link href={scheduleUrl} className="block">
          <ItemTitle className="text-lg font-semibold">
            {schedule.name}
          </ItemTitle>
          {schedule.description && (
            <ItemDescription className="line-clamp-2 leading-tight">
              {schedule.description}
            </ItemDescription>
          )}
        </Link>
      </ItemContent>

      <ItemActions onClick={(e) => e.stopPropagation()}>
        <ScheduleItemActions schedule={schedule} />
      </ItemActions>
    </Item>
  )
}
