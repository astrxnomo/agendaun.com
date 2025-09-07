import { Skeleton } from "@/components/ui/skeleton"

export function CalendarSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </header>

      <div className="border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      <div data-slot="month-view" className="contents">
        <div className="border-border/70 grid grid-cols-7 border-y uppercase">
          {["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"].map((day) => (
            <div
              key={day}
              className="text-muted-foreground/70 py-2 text-center text-xs"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid flex-1 auto-rows-fr">
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <div
              key={`week-${weekIndex}`}
              className="grid grid-cols-7 [&:last-child>*]:border-b-0"
            >
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const cellIndex = weekIndex * 7 + dayIndex

                return (
                  <div
                    key={`day-${cellIndex}`}
                    className="group border-border/70 border-r border-b last:border-r-0"
                  >
                    <div className="p-2">
                      <div className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]">
                        {cellIndex % 7 === 2 && (
                          <div className="mt-1 space-y-1">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-3/4 rounded" />
                          </div>
                        )}
                        {cellIndex % 11 === 0 && (
                          <div className="mt-1">
                            <Skeleton className="h-4 w-4/5 rounded" />
                          </div>
                        )}
                        {cellIndex % 13 === 0 && (
                          <div className="mt-1 space-y-1">
                            <Skeleton className="h-4 w-full rounded" />
                          </div>
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
