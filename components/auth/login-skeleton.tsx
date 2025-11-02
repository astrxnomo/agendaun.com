import { Skeleton } from "@/components/ui/skeleton"

export function LoginSkeleton() {
  return (
    <main className="flex min-h-[75vh] w-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-10">
        {/* Header Section Skeleton */}
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <Skeleton className="size-20 rounded-2xl" />
          </div>
          <div className="space-y-3">
            <Skeleton className="mx-auto h-8 w-48" />
            <Skeleton className="mx-auto h-4 w-64" />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Footer Skeleton */}
        <div className="border-border/30 border-t pt-8 text-center">
          <Skeleton className="mx-auto h-3 w-64" />
        </div>
      </div>
    </main>
  )
}
