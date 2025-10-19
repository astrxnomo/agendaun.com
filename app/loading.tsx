import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <header className="flex h-12 items-center border-b px-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </header>
  )
}
