import { EditModeToggle } from "@/components/calendar/edit-mode-toggle"

import type { Schedules } from "@/types"

interface ScheduleHeaderProps {
  schedule: Schedules
  editMode: boolean
  canEdit: boolean
  onToggleEditMode: () => void
}

export function ScheduleHeader({
  schedule,
  editMode,
  canEdit,
  onToggleEditMode,
}: ScheduleHeaderProps) {
  return (
    <div className="bg-background top-12 z-30">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold">{schedule.name}</h1>
          {schedule.category && (
            <p className="text-muted-foreground text-sm">
              {schedule.category.name}
            </p>
          )}
        </div>
        {canEdit && (
          <div className="flex shrink-0 items-center gap-2">
            <EditModeToggle
              checked={editMode}
              onCheckedChange={onToggleEditMode}
            />
          </div>
        )}
      </div>
    </div>
  )
}
