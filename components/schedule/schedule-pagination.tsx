"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"

type SchedulePaginationProps = {
  currentPage: number
  totalPages: number
  category: string
}

export function SchedulePagination({
  currentPage,
  totalPages,
  category,
}: SchedulePaginationProps) {
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `/schedules/${category}?${params.toString()}`
  }

  return (
    <Pagination>
      <PaginationContent className="gap-3">
        <PaginationItem>
          <PaginationLink
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={
              currentPage === 1 ? undefined : createPageURL(currentPage - 1)
            }
            aria-label="Ir a la página anterior"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? "link" : undefined}
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            Página <span className="text-foreground">{currentPage}</span> de{" "}
            <span className="text-foreground">{totalPages}</span>
          </p>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={
              currentPage === totalPages
                ? undefined
                : createPageURL(currentPage + 1)
            }
            aria-label="Ir a la página siguiente"
            aria-disabled={currentPage === totalPages ? true : undefined}
            role={currentPage === totalPages ? "link" : undefined}
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
