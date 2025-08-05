"use client"

import { Building2, Filter, GraduationCap, MapPin, X } from "lucide-react"
import { memo, useCallback } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import { useUniversityFilters } from "@/contexts/university-filter-context"

// Mapeo de sedes con información visual optimizada
const CAMPUS_INFO = {
  bog: { name: "Bogotá", emoji: "🏛️", shortName: "BOG" },
  med: { name: "Medellín", emoji: "🏔️", shortName: "MED" },
  man: { name: "Manizales", emoji: "☕", shortName: "MAN" },
  pal: { name: "Palmira", emoji: "🌾", shortName: "PAL" },
  ori: { name: "Orinoquia", emoji: "🌅", shortName: "ORI" },
  ama: { name: "Amazonia", emoji: "🌳", shortName: "AMA" },
  car: { name: "Caribe", emoji: "🏝️", shortName: "CAR" },
  tum: { name: "Tumaco", emoji: "🌊", shortName: "TUM" },
} as const

// Componente de badge de filtro activo optimizado
const FilterBadge = memo(
  ({
    icon: Icon,
    label,
    value,
    onRemove,
  }: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
    onRemove: () => void
  }) => (
    <Badge variant="secondary" className="gap-1 pr-1 pl-2">
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">
        {label}: {value}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-destructive hover:text-destructive-foreground h-4 w-4 p-0"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  ),
)

FilterBadge.displayName = "FilterBadge"

// Componente principal optimizado
export const UniversityFiltersDialog = memo(() => {
  const {
    filters,
    setFilters,
    selectedCampus,
    selectedFaculty,
    selectedStudyProgram,
    availableFaculties,
    availableStudyPrograms,
    resetFilters,
  } = useUniversityFilters()

  // Callbacks optimizados para evitar re-renders
  const handleCampusChange = useCallback(
    (value: string) => {
      setFilters({ campusId: value || null })
    },
    [setFilters],
  )

  const handleFacultyChange = useCallback(
    (value: string) => {
      setFilters({ facultyId: value || null })
    },
    [setFilters],
  )

  const handleStudyProgramChange = useCallback(
    (value: string) => {
      setFilters({ studyProgramId: value || null })
    },
    [setFilters],
  )

  const removeCampusFilter = useCallback(() => {
    setFilters({ campusId: null })
  }, [setFilters])

  const removeFacultyFilter = useCallback(() => {
    setFilters({ facultyId: null })
  }, [setFilters])

  const removeStudyProgramFilter = useCallback(() => {
    setFilters({ studyProgramId: null })
  }, [setFilters])

  // Contador de filtros activos para optimización
  const activeFiltersCount = [
    filters.campusId,
    filters.facultyId,
    filters.studyProgramId,
  ].filter(Boolean).length

  // Información del campus actual
  const currentCampusInfo = filters.campusId
    ? CAMPUS_INFO[filters.campusId as keyof typeof CAMPUS_INFO]
    : null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              tooltip={`Filtros universitarios${activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}`}
            >
              <div className="bg-primary text-primary-foreground relative flex aspect-square size-8 items-center justify-center rounded-lg">
                <Filter className="size-4" />
                {activeFiltersCount > 0 && (
                  <div className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                    {activeFiltersCount}
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  Filtros{" "}
                  {currentCampusInfo && `- ${currentCampusInfo.shortName}`}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {activeFiltersCount > 0
                    ? `${activeFiltersCount} filtro${activeFiltersCount > 1 ? "s" : ""} activo${activeFiltersCount > 1 ? "s" : ""}`
                    : "Configurar sede y facultad"}
                </span>
              </div>
            </SidebarMenuButton>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Universitarios
              </DialogTitle>
              <DialogDescription>
                Configura tu sede, facultad y programa para personalizar el
                contenido
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Filtros Activos */}
              {activeFiltersCount > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Filtros Activos</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="h-7 text-xs"
                    >
                      Limpiar todo
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampus && (
                      <FilterBadge
                        icon={MapPin}
                        label="Sede"
                        value={selectedCampus.name}
                        onRemove={removeCampusFilter}
                      />
                    )}
                    {selectedFaculty && (
                      <FilterBadge
                        icon={Building2}
                        label="Facultad"
                        value={selectedFaculty.name}
                        onRemove={removeFacultyFilter}
                      />
                    )}
                    {selectedStudyProgram && (
                      <FilterBadge
                        icon={GraduationCap}
                        label="Programa"
                        value={selectedStudyProgram.name}
                        onRemove={removeStudyProgramFilter}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Selector de Sede */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Sede
                </label>
                <Select
                  value={filters.campusId || ""}
                  onValueChange={handleCampusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sede" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CAMPUS_INFO).map(([id, info]) => (
                      <SelectItem key={id} value={id}>
                        <span className="flex items-center gap-2">
                          <span>{info.emoji}</span>
                          <span>{info.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {info.shortName}
                          </Badge>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de Facultad */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4" />
                  Facultad
                </label>
                <Select
                  value={filters.facultyId || ""}
                  onValueChange={handleFacultyChange}
                  disabled={
                    !filters.campusId || availableFaculties.length === 0
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !filters.campusId
                          ? "Primero selecciona una sede"
                          : availableFaculties.length === 0
                            ? "No hay facultades disponibles"
                            : "Seleccionar facultad"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFaculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        <span className="flex items-center gap-2">
                          <span>{faculty.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {faculty.code}
                          </Badge>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de Programa de Estudio */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="h-4 w-4" />
                  Programa de Estudio
                </label>
                <Select
                  value={filters.studyProgramId || ""}
                  onValueChange={handleStudyProgramChange}
                  disabled={
                    !filters.facultyId || availableStudyPrograms.length === 0
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !filters.facultyId
                          ? "Primero selecciona una facultad"
                          : availableStudyPrograms.length === 0
                            ? "No hay programas disponibles"
                            : "Seleccionar programa"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStudyPrograms.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        <div className="flex items-center gap-2">
                          <span>{program.name}</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {program.code}
                            </Badge>
                            <Badge
                              variant={
                                program.level === "undergraduate"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {program.level === "undergraduate"
                                ? "Pregrado"
                                : program.level === "graduate"
                                  ? "Posgrado"
                                  : "Doctorado"}
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Información contextual */}
              {currentCampusInfo && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{currentCampusInfo.emoji}</span>
                    <span className="font-medium">
                      Universidad Nacional de Colombia
                    </span>
                    <Badge variant="outline">{currentCampusInfo.name}</Badge>
                  </div>
                  {selectedFaculty && (
                    <div className="text-muted-foreground mt-1 text-xs">
                      Facultad de {selectedFaculty.name}
                      {selectedStudyProgram &&
                        ` • ${selectedStudyProgram.name}`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
})

UniversityFiltersDialog.displayName = "UniversityFiltersDialog"

// Export por defecto para compatibilidad
export { UniversityFiltersDialog as Filters }
