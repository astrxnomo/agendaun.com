import { getEtiquetteColor } from "@/components/calendar"
import { Badge } from "@/components/ui/badge"

import type { Etiquettes } from "@/types"

interface EtiquettesHeaderProps {
  etiquettes: Etiquettes[]
  editButton: React.ReactNode
  etiquettesManager: React.ReactNode
  isEtiquetteVisible: (etiquetteId: string | undefined) => boolean
  toggleEtiquetteVisibility: (etiquetteId: string) => void
}

export function EtiquettesHeader({
  etiquettes,
  editButton,
  etiquettesManager,
  isEtiquetteVisible,
  toggleEtiquetteVisibility,
}: EtiquettesHeaderProps) {
  return (
    <div className="bg-background sticky top-12 z-30 border-b">
      <div className="flex items-center justify-between">
        <div className="scrollbar-none flex h-12 items-center overflow-x-auto">
          {etiquettesManager}
          <div className="ml-2 flex shrink-0 items-center gap-1">
            {etiquettes.map((etiquette) => (
              <Badge
                key={etiquette.$id}
                variant={
                  isEtiquetteVisible(etiquette.$id) ? "default" : "secondary"
                }
                className={`cursor-pointer select-none hover:opacity-80 ${
                  isEtiquetteVisible(etiquette.$id)
                    ? getEtiquetteColor(etiquette.color)
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
        {editButton}
      </div>
    </div>
  )
}
