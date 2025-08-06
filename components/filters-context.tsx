"use client"
import { createContext, useContext, useState, type ReactNode } from "react"

interface Filters {
  sede: string
  facultad: string
  programa: string
}

interface FiltersContextType {
  filters: Filters
  setFilters: (filters: Filters) => void
  handleFilterChange: (type: string, value: string) => void
  clearFilters: () => void
  activeFiltersCount: number
  formatLabel: (value: string) => string
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({
    sede: "",
    facultad: "",
    programa: "",
  })

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }))
  }

  const clearFilters = () => {
    setFilters({ sede: "", facultad: "", programa: "" })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const formatLabel = (value: string) => {
    return value.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setFilters,
        handleFilterChange,
        clearFilters,
        activeFiltersCount,
        formatLabel,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FiltersContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider")
  }
  return context
}
