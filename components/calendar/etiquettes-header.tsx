import { CalendarSync } from "lucide-react"

import { getColor } from "@/components/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { EditModeToggle } from "./edit-mode-toggle"
import { EtiquettesManager } from "./etiquettes-manager"

import type { Calendars } from "@/lib/appwrite/types"

interface EtiquettesHeaderProps {
  calendar: Calendars
  editMode: boolean
  canEdit: boolean
  onToggleEditMode: () => void
  onManualRefetch: () => void
  isEtiquetteVisible: (etiquetteId: string | undefined) => boolean
  toggleEtiquetteVisibility: (etiquetteId: string) => void
}

export function EtiquettesHeader({
  calendar,
  editMode,
  canEdit,
  onToggleEditMode,
  onManualRefetch,
  isEtiquetteVisible,
  toggleEtiquetteVisibility,
}: EtiquettesHeaderProps) {
  return (
    <div className="bg-background sticky top-12 z-30 border-b">
      <div className="flex items-center justify-between">
        <div className="scrollbar-none flex h-12 items-center overflow-x-auto">
          {canEdit && editMode && (
            <EtiquettesManager calendar={calendar} onUpdate={onManualRefetch} />
          )}
          <div className="ml-2 flex shrink-0 items-center gap-1">
            {calendar.etiquettes.map((etiquette) => (
              <Badge
                key={etiquette.$id}
                variant={
                  isEtiquetteVisible(etiquette.$id) ? "default" : "secondary"
                }
                className={`cursor-pointer select-none hover:opacity-80 ${
                  isEtiquetteVisible(etiquette.$id)
                    ? getColor(etiquette.color)
                    : "opacity-50"
                }`}
                onClick={() => {
                  toggleEtiquetteVisibility(etiquette.$id)
                }}
              >
                {etiquette.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2 px-4">
          {canEdit && (
            <EditModeToggle
              checked={editMode}
              onCheckedChange={onToggleEditMode}
              disabled={!canEdit}
            />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={onManualRefetch}>
                <CalendarSync />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Actualizar calendario</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
