import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Cargando...", isCurrentPage: true }]}
      />
      <main className="flex min-h-[70vh] w-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 scale-150 rounded-full blur-xl"></div>
                <div className="relative rounded-2xl border p-6 shadow-sm">
                  <Skeleton className="size-8" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="mx-auto h-8 w-48" />
              <div className="space-y-2">
                <Skeleton className="mx-auto h-4 w-72" />
                <Skeleton className="mx-auto h-4 w-56" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="mx-auto h-12 w-40" />

            <div className="border-border/30 border-t pt-4 text-center">
              <div className="space-y-1">
                <Skeleton className="mx-auto h-3 w-48" />
                <Skeleton className="mx-auto h-3 w-32" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
