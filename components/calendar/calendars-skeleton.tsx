import { Skeleton } from "@/components/ui/skeleton"

export function CalendarsSkeleton() {
  return (
    <div className="p-6 md:p-10 lg:p-20">
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted/40 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-lg" />
              <Skeleton className="h-6 flex-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
