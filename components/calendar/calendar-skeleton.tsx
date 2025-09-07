import { Skeleton } from "@/components/ui/skeleton"

export function CalendarSkeleton() {
  return (
    <div className="h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-18" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-4 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
