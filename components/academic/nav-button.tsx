"use client"

import { MapPinned } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAcademicConfig } from "@/contexts/academic-context"

import { ConfigDialog } from "./dialog"

export function AcademicConfig() {
  const { isComplete, isLoading } = useAcademicConfig()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-20" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={
              !isComplete
                ? "relative animate-pulse border border-dashed border-amber-300 bg-amber-500 text-white hover:bg-amber-500/90 dark:border-amber-500 dark:bg-amber-500 dark:hover:bg-amber-500/90"
                : ""
            }
            aria-label="Configuración académica"
            variant={isComplete ? "ghost" : undefined}
          >
            <MapPinned size={16} />
            {!isComplete && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 min-w-4 animate-ping bg-amber-200 px-1 text-[8px] text-amber-600 dark:bg-amber-600 dark:text-amber-200"
              >
                !
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <ConfigDialog />
      </Dialog>
    </div>
  )
}
