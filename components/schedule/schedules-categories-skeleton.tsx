import { Skeleton } from "@/components/ui/skeleton"

export function SchedulesCategoriesSkeleton() {
  return (
    <div className="p-6 md:p-10 lg:p-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted/40 rounded-xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-lg" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="size-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
