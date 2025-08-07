"use client"

import { Badge } from "@/components/ui/badge"

import { getEtiquetteColor } from "./utils"

import type { Etiquette } from "./types"

interface EtiquettesHeaderProps {
  etiquettes: Etiquette[]
  isEtiquetteVisible: (color: string | undefined) => boolean
  toggleEtiquetteVisibility: (color: string) => void
}

export function EtiquettesHeader({
  etiquettes,
  isEtiquetteVisible,
  toggleEtiquetteVisibility,
}: EtiquettesHeaderProps) {
  return (
    <div className="bg-background sticky top-0 z-10 border-b shadow-sm">
      <div className="scrollbar-none flex h-12 shrink-0 items-center gap-2 overflow-x-auto px-4">
        <span className="text-muted-foreground mr-2 shrink-0 text-sm font-medium">
          Etiquetas
        </span>

        <div className="flex shrink-0 items-center gap-1">
          {etiquettes.map((etiquette) => (
            <Badge
              key={etiquette.id}
              variant={
                isEtiquetteVisible(etiquette.color) ? "default" : "secondary"
              }
              className={`cursor-pointer select-none hover:opacity-80 ${
                isEtiquetteVisible(etiquette.color)
                  ? getEtiquetteColor(etiquette.color)
                  : "opacity-50"
              }`}
              onClick={() => {
                toggleEtiquetteVisibility(etiquette.color)
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
