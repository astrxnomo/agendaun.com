import { Skeleton } from "@/components/ui/skeleton"

export function ScheduleItemSkeleton() {
  return (
    <div className="bg-muted/40 relative flex h-full flex-col overflow-hidden rounded transition-all duration-200">
      <div className="flex items-start gap-4 p-6">
        <div className="flex-shrink-0 rounded-lg p-3">
          <Skeleton className="h-6 w-6 rounded-sm" />
        </div>
        <div className="min-w-0 flex-1">
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  )
}

export function SchedulesSkeleton() {
  return (
    <>
      <header className="flex h-12 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </header>

      <div className="border-b px-6 py-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-40" />
      </div>
      <div className="p-6 md:p-10 lg:p-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => {
            return <ScheduleItemSkeleton key={i} />
          })}
        </div>
      </div>
    </>
  )
}
