import { Skeleton } from "@/components/ui/skeleton"

export default function SchedulesCategoriesLoading() {
  return (
    <>
      {/* PageHeader Skeleton */}
      <header className="flex h-12 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-20" />
        </div>
      </header>

      {/* Header Section */}
      <div className="border-b p-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-5 w-96" />
      </div>

      {/* Categories Grid */}
      <div className="p-6 md:p-10 lg:p-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted/40 block overflow-hidden rounded-xl border p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-7 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
