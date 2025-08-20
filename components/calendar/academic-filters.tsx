"use client"

import { Check, X } from "lucide-react"
import { useMemo } from "react"

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// TODO: Obtener estos datos de la API
const MOCK_SEDES = [
  { id: "sede-central", name: "Sede Central" },
  { id: "sede-norte", name: "Sede Norte" },
  { id: "sede-sur", name: "Sede Sur" },
]

const MOCK_FACULTADES = [
  { id: "facultad-ingenieria", name: "Facultad de Ingeniería" },
  { id: "facultad-medicina", name: "Facultad de Medicina" },
  { id: "facultad-derecho", name: "Facultad de Derecho" },
]

const MOCK_PROGRAMAS = [
  { id: "programa-sistemas", name: "Ingeniería de Sistemas" },
  { id: "programa-civil", name: "Ingeniería Civil" },
  { id: "programa-medicina", name: "Medicina" },
]

interface AcademicFiltersProps {
  className?: string
  calendarType: "national" | "sede" | "facultad" | "programa" | "personal"
  academicFilters: {
    sede: string
    facultad: string
    programa: string
  }
  actions: {
    setAcademicFilter?: (
      filterType: "sede" | "facultad" | "programa",
      value: string,
    ) => void
    clearAcademicFilters?: () => void
  }
}

export function AcademicFilters({
  className,
  calendarType,
  academicFilters,
  actions,
}: AcademicFiltersProps) {
  const { sede, facultad, programa } = academicFilters

  // Determinar qué filtros mostrar según el tipo de calendario
  const showSedeFilter = ["sede", "facultad", "programa"].includes(calendarType)
  const showFacultadFilter = ["facultad", "programa"].includes(calendarType)
  const showProgramaFilter = calendarType === "programa"

  const clearAllFilters = () => {
    if (actions.clearAcademicFilters) {
      actions.clearAcademicFilters()
    }
  }

  const hasActiveFilters = Boolean(sede || facultad || programa)

  return (
    <div className={`border-b p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Filtros académicos:</span>

        {/* Filtro de Sede */}
        {showSedeFilter && (
          <FilterSelect
            value={sede}
            onValueChange={(value) =>
              actions.setAcademicFilter?.("sede", value)
            }
            options={MOCK_SEDES}
            placeholder="Seleccionar sede"
            label="Sede"
          />
        )}

        {/* Filtro de Facultad */}
        {showFacultadFilter && (
          <FilterSelect
            value={facultad}
            onValueChange={(value) =>
              actions.setAcademicFilter?.("facultad", value)
            }
            options={MOCK_FACULTADES}
            placeholder="Seleccionar facultad"
            label="Facultad"
          />
        )}

        {/* Filtro de Programa */}
        {showProgramaFilter && (
          <FilterSelect
            value={programa}
            onValueChange={(value) =>
              actions.setAcademicFilter?.("programa", value)
            }
            options={MOCK_PROGRAMAS}
            placeholder="Seleccionar programa"
            label="Programa"
          />
        )}

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Limpiar filtros
          </Button>
        )}

        {/* Mensaje informativo */}
        {!hasActiveFilters && (
          <span className="text-muted-foreground text-xs">
            Sin filtros activos - Se muestran todos los eventos
          </span>
        )}
      </div>
    </div>
  )
}

interface FilterSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: Array<{ id: string; name: string }>
  placeholder: string
  label: string
}

function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  label,
}: FilterSelectProps) {
  const selectedOption = useMemo(
    () => options.find((option) => option.id === value),
    [options, value],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          {selectedOption ? (
            <Badge variant="secondary" className="mr-1">
              {selectedOption.name}
            </Badge>
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={() => {
                    onValueChange(option.id === value ? "" : option.id)
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === option.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
