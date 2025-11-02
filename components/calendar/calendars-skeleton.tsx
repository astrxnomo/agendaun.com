import { Skeleton } from "@/components/ui/skeleton"

// Skeleton individual que coincide exactamente con CalendarItem
export function CalendarItemSkeleton() {
  return (
    <div className="bg-muted/40 border-input hover:border-primary/30 relative flex items-center gap-3 overflow-hidden rounded p-4 transition-all duration-200">
      {/* ItemMedia skeleton */}
      <div className="flex-shrink-0 rounded-lg p-3">
        <Skeleton className="h-6 w-6 rounded" />
      </div>

      {/* ItemContent skeleton */}
      <div className="min-w-0 flex-1">
        <Skeleton className="h-5 w-3/4" />
      </div>

      {/* ItemActions skeleton */}
      <div className="flex flex-shrink-0 items-center">
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  )
}

export function CalendarsSkeleton() {
  return (
    <div className="p-6 md:p-10 lg:p-20">
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <CalendarItemSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
