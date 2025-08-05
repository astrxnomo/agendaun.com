import { Building2, GraduationCap, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUniversityFilters } from "@/contexts/university-filter-context"

interface UniversityFilterSelectorProps {
  showTitle?: boolean
  compact?: boolean
  className?: string
}

export function UniversityFilterSelector({
  showTitle = true,
  compact = false,
  className = "",
}: UniversityFilterSelectorProps) {
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

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <MapPin className="text-muted-foreground h-4 w-4" />
          <Badge variant="outline" className="gap-1">
            {selectedCampus?.name || "Seleccionar sede"}
          </Badge>
        </div>

        {selectedFaculty && (
          <div className="flex items-center gap-1">
            <Building2 className="text-muted-foreground h-4 w-4" />
            <Badge variant="outline" className="gap-1">
              {selectedFaculty.name}
            </Badge>
          </div>
        )}

        {selectedStudyProgram && (
          <div className="flex items-center gap-1">
            <GraduationCap className="text-muted-foreground h-4 w-4" />
            <Badge variant="outline" className="gap-1">
              {selectedStudyProgram.name}
            </Badge>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Filtros Universitarios
          </CardTitle>
          <CardDescription>
            Selecciona la sede y facultad para filtrar el contenido
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Selector de Sede */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sede</label>
          <Select
            value={filters.campusId || ""}
            onValueChange={(value) => setFilters({ campusId: value || null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar sede" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bog">🏛️ Bogotá</SelectItem>
              <SelectItem value="med">🏔️ Medellín</SelectItem>
              <SelectItem value="man">☕ Manizales</SelectItem>
              <SelectItem value="pal">🌾 Palmira</SelectItem>
              <SelectItem value="ori">🌅 Orinoquia (Arauca)</SelectItem>
              <SelectItem value="ama">🌳 Amazonia (Leticia)</SelectItem>
              <SelectItem value="car">🏝️ Caribe (San Andrés)</SelectItem>
              <SelectItem value="tum">🌊 Tumaco</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selector de Facultad */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Facultad</label>
          <Select
            value={filters.facultyId || ""}
            onValueChange={(value) => setFilters({ facultyId: value || null })}
            disabled={!filters.campusId || availableFaculties.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar facultad" />
            </SelectTrigger>
            <SelectContent>
              {availableFaculties.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector de Programa de Estudio */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Programa de Estudio</label>
          <Select
            value={filters.studyProgramId || ""}
            onValueChange={(value) =>
              setFilters({ studyProgramId: value || null })
            }
            disabled={!filters.facultyId || availableStudyPrograms.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar programa" />
            </SelectTrigger>
            <SelectContent>
              {availableStudyPrograms.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                  <Badge variant="outline" className="ml-2">
                    {program.level === "undergraduate"
                      ? "Pregrado"
                      : program.level === "graduate"
                        ? "Posgrado"
                        : "Doctorado"}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Información actual y reset */}
        {(selectedCampus || selectedFaculty || selectedStudyProgram) && (
          <div className="border-t pt-4">
            <div className="mb-2 text-sm font-medium">Filtros activos:</div>
            <div className="text-muted-foreground space-y-1 text-sm">
              {selectedCampus && <div>📍 Sede: {selectedCampus.name}</div>}
              {selectedFaculty && (
                <div>🏛️ Facultad: {selectedFaculty.name}</div>
              )}
              {selectedStudyProgram && (
                <div>🎓 Programa: {selectedStudyProgram.name}</div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="mt-2"
            >
              Resetear filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
