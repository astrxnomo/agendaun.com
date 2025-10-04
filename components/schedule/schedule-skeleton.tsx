import { Skeleton } from "@/components/ui/skeleton"

export function ScheduleSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* PageHeader Skeleton */}
      <header className="flex h-12 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </header>

      {/* Schedule Header Skeleton */}
      <div className="border-b px-6 py-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-40" />
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-8 border-b">
        <div className="py-2 text-center">
          <Skeleton className="mx-auto h-3 w-12" />
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="py-2 text-center">
            <Skeleton className="mx-auto h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Schedule Grid Skeleton */}
      <div className="grid flex-1 grid-cols-8 overflow-hidden">
        {/* Hours column */}
        <div className="border-border/70 border-r">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="border-border/70 h-[72px] border-b" />
          ))}
        </div>

        {/* Day columns with random events */}
        {Array.from({ length: 7 }).map((_, dayIndex) => (
          <div
            key={dayIndex}
            className="border-border/70 relative border-r last:border-r-0"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="border-border/70 h-[72px] border-b" />
            ))}
            {/* Random event skeletons */}
            {dayIndex % 2 === 0 && (
              <>
                <Skeleton
                  className="absolute right-1 left-1 opacity-60"
                  style={{ top: "144px", height: "144px" }}
                />
                <Skeleton
                  className="absolute right-1 left-1 opacity-60"
                  style={{ top: "504px", height: "72px" }}
                />
              </>
            )}
            {dayIndex % 3 === 0 && (
              <Skeleton
                className="absolute right-1 left-1 opacity-60"
                style={{ top: "288px", height: "216px" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
