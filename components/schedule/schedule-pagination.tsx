"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"

type SchedulePaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
  isPending?: boolean
}

export function SchedulePagination({
  currentPage,
  totalPages,
  onPageChange,
  isPending = false,
}: SchedulePaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <Pagination>
      <PaginationContent className="gap-3">
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentPage === 1 || isPending}
            aria-label="Ir a la página anterior"
            className="h-9 w-9"
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            Página <span className="text-foreground">{currentPage}</span> de{" "}
            <span className="text-foreground">{totalPages}</span>
          </p>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentPage === totalPages || isPending}
            aria-label="Ir a la página siguiente"
            className="h-9 w-9"
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
