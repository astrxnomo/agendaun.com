import { useMemo } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Generate random event positions for skeleton - memoized to prevent re-renders
const generateRandomEventPositions = () => {
  const positions = []

  // Generate 8-15 random event positions across the 42 cells
  const eventCount = Math.floor(Math.random() * 8) + 8

  for (let i = 0; i < eventCount; i++) {
    const cellIndex = Math.floor(Math.random() * 42)
    const width = ["w-full", "w-4/5", "w-3/4", "w-5/6"][
      Math.floor(Math.random() * 4)
    ]
    const hasMultiple = Math.random() > 0.8 // 20% chance of having multiple events

    positions.push({
      cellIndex,
      width,
      hasMultiple,
    })
  }

  return positions
}

export function StatusSkeletonBackground() {
  const randomPositions = useMemo(() => generateRandomEventPositions(), [])

  return (
    <div className="flex h-screen min-h-screen w-full flex-col">
      {/* Month header */}
      <div className="flex shrink-0 items-center justify-between px-4 py-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* Calendar grid - takes remaining space */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Day headers */}
        <div className="border-border/70 grid shrink-0 grid-cols-7 border-y uppercase">
          {["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"].map((day) => (
            <div
              key={day}
              className="text-muted-foreground/70 py-2 text-center text-xs"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid min-h-0 flex-1 grid-rows-6">
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <div
              key={`week-${weekIndex}`}
              className="grid grid-cols-7 [&:last-child>*]:border-b-0"
            >
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const cellIndex = weekIndex * 7 + dayIndex
                const cellPositions = randomPositions.filter(
                  (pos) => pos.cellIndex === cellIndex,
                )

                return (
                  <div
                    key={`day-${cellIndex}`}
                    className="border-border/70 group min-h-0 border-r border-b last:border-r-0"
                  >
                    <div className="p-2">
                      <div className="space-y-1">
                        {cellPositions.length > 0 && (
                          <>
                            {cellPositions
                              .slice(0, 2)
                              .map((position, posIndex) => (
                                <Skeleton
                                  key={`skeleton-${cellIndex}-${posIndex}`}
                                  className={cn("h-4 rounded", position.width)}
                                />
                              ))}
                            {cellPositions.some((pos) => pos.hasMultiple) &&
                              cellPositions.length === 1 && (
                                <Skeleton className="h-4 w-3/4 rounded" />
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
