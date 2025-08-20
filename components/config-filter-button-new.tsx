"use client"

import {
  Check,
  ChevronsUpDown,
  GraduationCap,
  Loader2,
  School,
  Settings2,
  University,
} from "lucide-react"
import React, { useId, useState } from "react"

import { useAcademicFilters } from "@/components/calendar/hooks/use-academic-filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthContext } from "@/contexts/auth-context"

import type { AcademicFilters } from "@/components/calendar/hooks/use-academic-filters"

interface ConfigFilterButtonProps {
  variant?: "nav" | "sidebar"
  initialFilters?: AcademicFilters
  onFiltersChange?: (filters: AcademicFilters) => void
}

export default function ConfigFilterButton({
  variant = "nav",
  initialFilters = { sede: "", facultad: "", programa: "" },
  onFiltersChange,
}: ConfigFilterButtonProps) {
  const { user } = useAuthContext()
  const id = useId()
  const [open, setOpen] = useState(false)
  const [sedeOpen, setSedeOpen] = useState(false)
  const [facultadOpen, setFacultadOpen] = useState(false)
  const [programaOpen, setProgramaOpen] = useState(false)

  // Use academic filters hook with database integration
  const {
    academicData,
    filters,
    isLoading,
    isLoadingFacultades,
    isLoadingProgramas,
    error,
    setFilter,
    clearFilters,
    availableFacultades,
    availableProgramas,
    isComplete,
    activeFiltersCount,
  } = useAcademicFilters(initialFilters)

  // Notify parent when filters change
  React.useEffect(() => {
    onFiltersChange?.(filters)
  }, [filters, onFiltersChange])

  if (!user) {
    return null
  }

  // Get current selection display text
  const getCurrentSelectionText = () => {
    if (!filters.sede) return "Sin configurar"

    const parts = []
    if (filters.sede) {
      const sede = academicData.sedes.find((s) => s.slug === filters.sede)
      if (sede) parts.push(sede.name)
    }
    if (filters.facultad) {
      const facultad = availableFacultades.find(
        (f) => f.slug === filters.facultad,
      )
      if (facultad) parts.push(facultad.name)
    }
    if (filters.programa) {
      const programa = availableProgramas.find(
        (p) => p.slug === filters.programa,
      )
      if (programa) parts.push(programa.name)
    }

    return parts.join(" • ")
  }

  // Determinar si mostrar badges (solo en nav y no mobile)
  const showBadges = variant === "nav"

  // Contenido del diálogo
  const renderDialogContent = () => (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
            <Settings2 className="size-4" />
          </div>
          Configuración Académica
        </DialogTitle>
        <DialogDescription>
          Configura tu sede, facultad y programa para personalizar tu
          experiencia. Esto te permitirá acceder a horarios y eventos relevantes
          para ti.
        </DialogDescription>
      </DialogHeader>

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Configuration Form */}
        <div className="grid gap-4">
          {/* Sede */}
          <div className="space-y-2">
            <Label
              htmlFor={`${id}-sede`}
              className="flex items-center text-sm font-medium"
            >
              <School className="mr-1 size-4" />
              Sede
            </Label>
            <Popover open={sedeOpen} onOpenChange={setSedeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={sedeOpen}
                  disabled={isLoading}
                  className={`w-full justify-between py-6 ${
                    !filters.sede
                      ? "border-amber-300 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/50"
                      : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Cargando sedes...
                    </div>
                  ) : filters.sede ? (
                    academicData.sedes.find((s) => s.slug === filters.sede)
                      ?.name
                  ) : (
                    "Selecciona tu sede"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar sede..." />
                  <CommandList>
                    <CommandEmpty>No se encontró ninguna sede.</CommandEmpty>
                    <CommandGroup>
                      {academicData.sedes.map((sede) => (
                        <CommandItem
                          key={sede.$id}
                          value={sede.name}
                          onSelect={() => {
                            setFilter("sede", sede.slug)
                            setSedeOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              filters.sede === sede.slug
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{sede.name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Facultad */}
          <div className="space-y-2">
            <Label
              htmlFor={`${id}-facultad`}
              className="flex items-center text-sm font-medium"
            >
              <University className="mr-1 size-4" />
              Facultad
            </Label>
            <Popover open={facultadOpen} onOpenChange={setFacultadOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={facultadOpen}
                  disabled={!filters.sede || isLoadingFacultades}
                  className={`w-full justify-between py-6 ${
                    !filters.facultad && filters.sede
                      ? "border-amber-300 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/50"
                      : ""
                  }`}
                >
                  {isLoadingFacultades ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Cargando facultades...
                    </div>
                  ) : filters.facultad ? (
                    availableFacultades.find((f) => f.slug === filters.facultad)
                      ?.name
                  ) : !filters.sede ? (
                    "Primero selecciona una sede"
                  ) : (
                    "Selecciona tu facultad"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar facultad..." />
                  <CommandList>
                    <CommandEmpty>
                      No se encontró ninguna facultad.
                    </CommandEmpty>
                    <CommandGroup>
                      {availableFacultades.map((facultad) => (
                        <CommandItem
                          key={facultad.$id}
                          value={facultad.name}
                          onSelect={() => {
                            setFilter("facultad", facultad.slug)
                            setFacultadOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              filters.facultad === facultad.slug
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{facultad.name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Programa */}
          <div className="space-y-2">
            <Label
              htmlFor={`${id}-programa`}
              className="flex items-center text-sm font-medium"
            >
              <GraduationCap className="mr-1 size-4" />
              Programa
            </Label>
            <Popover open={programaOpen} onOpenChange={setProgramaOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={programaOpen}
                  disabled={!filters.facultad || isLoadingProgramas}
                  className={`w-full justify-between py-6 ${
                    !filters.programa && filters.facultad
                      ? "border-amber-300 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/50"
                      : ""
                  }`}
                >
                  {isLoadingProgramas ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Cargando programas...
                    </div>
                  ) : filters.programa ? (
                    availableProgramas.find((p) => p.slug === filters.programa)
                      ?.name
                  ) : !filters.facultad ? (
                    "Primero selecciona una facultad"
                  ) : (
                    "Selecciona tu programa"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar programa..." />
                  <CommandList>
                    <CommandEmpty>No se encontró ningún programa.</CommandEmpty>
                    <CommandGroup>
                      {availableProgramas.map((programa) => (
                        <CommandItem
                          key={programa.$id}
                          value={programa.name}
                          onSelect={() => {
                            setFilter("programa", programa.slug)
                            setProgramaOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              filters.programa === programa.slug
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {programa.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            clearFilters()
          }}
        >
          Limpiar
        </Button>
        <Button onClick={() => setOpen(false)} disabled={!isComplete}>
          {isComplete ? "Guardar" : "Completar configuración"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  if (variant === "sidebar") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={
                  !isComplete
                    ? "animate-pulse border border-dashed border-amber-300 dark:border-amber-500"
                    : ""
                }
                tooltip={
                  !isComplete
                    ? "Configura tu ubicación académica"
                    : "Configuración académica"
                }
              >
                <div
                  className={`relative flex aspect-square size-8 items-center justify-center rounded-lg ${
                    !isComplete
                      ? "bg-amber-500 text-white dark:bg-amber-500"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <School className="size-4" />
                  {!isComplete && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 min-w-4 animate-ping bg-amber-200 px-1 text-[8px] text-amber-600 dark:bg-amber-600 dark:text-amber-200"
                    >
                      !
                    </Badge>
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {!isComplete ? "Establecer sede" : "Mi sede"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {isComplete
                      ? getCurrentSelectionText()
                      : "Sede, facultad y programa"}
                  </span>
                </div>
              </SidebarMenuButton>
            </DialogTrigger>
            {renderDialogContent()}
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className={
              !isComplete
                ? "relative animate-pulse border border-dashed border-amber-300 bg-amber-500 text-white hover:bg-amber-500/90 dark:border-amber-500 dark:bg-amber-500 dark:hover:bg-amber-500/90"
                : ""
            }
            aria-label="Configuración académica"
          >
            <School size={16} />
            Mi sede
            {!isComplete && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 min-w-4 animate-ping bg-amber-200 px-1 text-[8px] text-amber-600 dark:bg-amber-600 dark:text-amber-200"
              >
                !
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        {renderDialogContent()}
      </Dialog>
      {/* Active filters badges */}
      {showBadges && filters.sede && (
        <Badge variant="secondary" className="text-xs">
          <School className="mr-1 size-3" />
          {academicData.sedes.find((s) => s.slug === filters.sede)?.name}
        </Badge>
      )}
      {showBadges && filters.facultad && (
        <Badge variant="secondary" className="text-xs">
          <University className="mr-1 size-3" />
          {availableFacultades.find((f) => f.slug === filters.facultad)?.name}
        </Badge>
      )}
      {showBadges && filters.programa && (
        <Badge variant="secondary" className="text-xs">
          <GraduationCap className="mr-1 size-3" />
          {availableProgramas.find((p) => p.slug === filters.programa)?.name}
        </Badge>
      )}
    </div>
  )
}
