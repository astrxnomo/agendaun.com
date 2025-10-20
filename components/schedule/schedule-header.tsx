import { EditModeToggle } from "@/components/calendar/edit-mode-toggle"

import type { Schedules } from "@/lib/appwrite/types"

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
      <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">
            {schedule.name}
          </h1>
          <div className="flex flex-col gap-1">
            {schedule.category && (
              <p className="text-muted-foreground truncate text-sm">
                {schedule.category.name}
              </p>
            )}
            {schedule.description && (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {schedule.description}
              </p>
            )}
          </div>
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
