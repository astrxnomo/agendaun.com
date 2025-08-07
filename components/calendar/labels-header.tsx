"use client"

import { getEventColorClasses } from "@/components/calendar/colors"
import { Badge } from "@/components/ui/badge"

import type { Etiquette } from "./types"

interface LabelsHeaderProps {
  etiquettes: Etiquette[]
  isColorVisible: (color: string | undefined) => boolean
  toggleColorVisibility: (color: string) => void
  title?: string
}

export function LabelsHeader({
  etiquettes,
  isColorVisible,
  toggleColorVisibility,
  title = "Etiquetas",
}: LabelsHeaderProps) {
  return (
    <div className="bg-background sticky top-0 z-10 border-b shadow-sm">
      <div className="scrollbar-none flex h-12 shrink-0 items-center gap-2 overflow-x-auto px-4">
        <span className="text-muted-foreground mr-2 shrink-0 text-sm font-medium">
          {title}
        </span>

        {/* Etiquetas existentes */}
        <div className="flex shrink-0 items-center gap-1">
          {etiquettes.map((etiquette) => (
            <Badge
              key={etiquette.id}
              variant={
                isColorVisible(etiquette.color) ? "default" : "secondary"
              }
              className={`cursor-pointer transition-all hover:opacity-80 ${
                isColorVisible(etiquette.color)
                  ? getEventColorClasses(etiquette.color)
                  : "opacity-50"
              }`}
              onClick={() => {
                toggleColorVisibility(etiquette.color)
              }}
            >
              {etiquette.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
