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

export function CalendarError({
  error,
  retry,
}: {
  error: string
  retry?: () => void
}) {
  return (
    <div className="h-96 flex-col items-center justify-center p-6">
      <div className="space-y-4 text-center">
        <h2 className="text-destructive text-xl font-semibold">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        {retry && (
          <button
            onClick={retry}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  )
}
