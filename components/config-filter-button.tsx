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
import { toast } from "sonner"

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
import {
  getUserProfile,
  updateUserProfile,
} from "@/lib/actions/profile.actions"

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
  } = useAcademicFilters(initialFilters)

  // Enhanced setFilter function with profile saving
  const handleFilterChange = async (
    key: keyof AcademicFilters,
    value: string,
  ) => {
    console.log("🔄 Cambiando filtro:", { key, value })
    console.log("📊 Estado actual filters:", filters)
    setFilter(key, value)
    console.log("✅ setFilter llamado")

    // Save to user profile if user is authenticated
    if (user?.$id) {
      try {
        const profileData = {
          user_id: user.$id,
          sede_id: key === "sede" ? value : filters.sede || null,
          faculty_id: key === "facultad" ? value : filters.facultad || null,
          program_id: key === "programa" ? value : filters.programa || null,
        }

        console.log("💾 Guardando perfil:", profileData)
        const result = await updateUserProfile(profileData)

        if (result.success) {
          toast.success("Configuración guardada")
          console.log("✅ Perfil guardado exitosamente:", result.profile)
        } else {
          console.error("❌ Error guardando perfil:", result.error)
          toast.error("Error guardando configuración")
        }
      } catch (error) {
        console.error("❌ Error en handleFilterChange:", error)
        toast.error("Error guardando configuración")
      }
    }
  }

  // Load user profile on mount
  React.useEffect(() => {
    if (user?.$id) {
      const loadUserProfile = async () => {
        try {
          console.log("🔄 Cargando perfil del usuario:", user.$id)
          const result = await getUserProfile(user.$id)

          if (result.success && result.profile) {
            console.log("✅ Perfil cargado:", result.profile)

            // Update filters based on saved profile
            if (result.profile.sede_id) {
              setFilter("sede", result.profile.sede_id)
            }
            if (result.profile.faculty_id) {
              setFilter("facultad", result.profile.faculty_id)
            }
            if (result.profile.program_id) {
              setFilter("programa", result.profile.program_id)
            }
          } else {
            console.log("ℹ️ No hay perfil guardado para este usuario")
          }
        } catch (error) {
          console.error("❌ Error cargando perfil:", error)
        }
      }

      void loadUserProfile()
    }
  }, [user?.$id, setFilter])

  // Debug: mostrar cambios en filters
  React.useEffect(() => {
    console.log("📈 Filters cambió:", filters)
  }, [filters])

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
      const sede = academicData.sedes.find((s) => s.$id === filters.sede)
      if (sede) parts.push(sede.name)
    }
    if (filters.facultad) {
      const facultad = availableFacultades.find(
        (f) => f.$id === filters.facultad,
      )
      if (facultad) parts.push(facultad.name)
    }
    if (filters.programa) {
      const programa = availableProgramas.find(
        (p) => p.$id === filters.programa,
      )
      if (programa) parts.push(programa.name)
    }

    return parts.join(" • ")
  }

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
                    (() => {
                      const sedeEncontrada = academicData.sedes.find(
                        (s) => s.$id === filters.sede,
                      )
                      console.log("🔍 Buscando sede:", {
                        filtroSede: filters.sede,
                        sedesDisponibles: academicData.sedes.map((s) => s.$id),
                        sedeEncontrada,
                      })
                      return sedeEncontrada?.name || "Sede no encontrada"
                    })()
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
                            console.log("🎯 Sede seleccionada:", sede.name)
                            void handleFilterChange("sede", sede.$id) // Usar $id directamente
                            setSedeOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              filters.sede === sede.$id
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
                    availableFacultades.find((f) => f.$id === filters.facultad)
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
                            void handleFilterChange("facultad", facultad.$id)
                            setFacultadOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              filters.facultad === facultad.$id
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
                    availableProgramas.find((p) => p.$id === filters.programa)
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
                            void handleFilterChange("programa", programa.$id)
                            setProgramaOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              filters.programa === programa.$id
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
    </div>
  )
}
