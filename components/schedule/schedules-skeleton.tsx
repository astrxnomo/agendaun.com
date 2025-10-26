import { Skeleton } from "@/components/ui/skeleton"

export function SchedulesSkeleton() {
  return (
    <div className="p-6 md:p-10 lg:p-20">
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted/40 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="size-10" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
