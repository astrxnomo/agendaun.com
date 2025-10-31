import { Info, Plus } from "lucide-react"

import { EditModeToggle } from "@/components/calendar/edit-mode-toggle"
import { Button } from "@/components/ui/button"

import type { Schedules } from "@/lib/data/types"
import { formatHour } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface ScheduleHeaderProps {
  schedule: Schedules
  editMode: boolean
  canEdit: boolean
  onToggleEditMode: () => void
  onNewEvent?: () => void
}

export function ScheduleHeader({
  schedule,
  editMode,
  canEdit,
  onToggleEditMode,
  onNewEvent,
}: ScheduleHeaderProps) {
  return (
    <div className="bg-background top-12 z-30">
      <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">
            <div className="flex items-center gap-2">
              <span>{schedule.name}</span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0"
                    aria-label="Ver descripción completa"
                  >
                    <Info />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="max-w-sm whitespace-pre-wrap"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold">{schedule.name}</h4>
                    <p className="text-muted-foreground text-sm">
                      {formatHour(schedule.start_hour)} -{" "}
                      {formatHour(schedule.end_hour)}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {schedule.description}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </h1>
          <div className="flex flex-col gap-1">
            {schedule.category && (
              <p className="text-muted-foreground truncate text-sm">
                {schedule.category.name}
              </p>
            )}
            {schedule.description && (
              <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
                {schedule.description}
              </p>
            )}
          </div>
        </div>
        {canEdit && (
          <div className="flex shrink-0 items-center gap-2">
            {editMode && onNewEvent && (
              <Button onClick={onNewEvent} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Evento
              </Button>
            )}
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
