"use client"

import {
  Check,
  ChevronsUpDown,
  GraduationCap,
  School,
  Settings2,
  University,
} from "lucide-react"
import { useId, useMemo, useState } from "react"

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

import type { User } from "@/types/auth"

// Estructura jerárquica de sedes -> facultades -> programas
type AcademicStructure = Record<
  string,
  {
    name: string
    facultades: Record<
      string,
      {
        name: string
        programas: Record<string, string>
      }
    >
  }
>

const academicStructure: AcademicStructure = {
  "sede-bogota": {
    name: "Sede Bogotá",
    facultades: {
      ingenieria: {
        name: "Facultad de Ingeniería",
        programas: {
          "ingenieria-sistemas": "Ingeniería de Sistemas y Computación",
          "ingenieria-industrial": "Ingeniería Industrial",
          "ingenieria-civil": "Ingeniería Civil",
          "ingenieria-electronica": "Ingeniería Electrónica",
          "ingenieria-mecanica": "Ingeniería Mecánica",
          "ingenieria-quimica": "Ingeniería Química",
        },
      },
      medicina: {
        name: "Facultad de Medicina",
        programas: {
          medicina: "Medicina",
          enfermeria: "Enfermería",
          fisioterapia: "Fisioterapia",
          fonoaudiologia: "Fonoaudiología",
          "terapia-ocupacional": "Terapia Ocupacional",
        },
      },
      ciencias: {
        name: "Facultad de Ciencias",
        programas: {
          biologia: "Biología",
          quimica: "Química",
          fisica: "Física",
          matematicas: "Matemáticas",
          estadistica: "Estadística",
          geologia: "Geología",
        },
      },
      "ciencias-economicas": {
        name: "Facultad de Ciencias Económicas",
        programas: {
          "administracion-empresas": "Administración de Empresas",
          "contaduria-publica": "Contaduría Pública",
          economia: "Economía",
        },
      },
      derecho: {
        name: "Facultad de Derecho, Ciencias Políticas y Sociales",
        programas: {
          derecho: "Derecho",
          "ciencias-politicas": "Ciencias Políticas",
          sociologia: "Sociología",
          antropologia: "Antropología",
        },
      },
      "ciencias-humanas": {
        name: "Facultad de Ciencias Humanas",
        programas: {
          psicologia: "Psicología",
          filosofia: "Filosofía",
          historia: "Historia",
          geografia: "Geografía",
          "trabajo-social": "Trabajo Social",
        },
      },
      artes: {
        name: "Facultad de Artes",
        programas: {
          "artes-plasticas": "Artes Plásticas",
          musica: "Música",
          "diseno-grafico": "Diseño Gráfico",
          "diseno-industrial": "Diseño Industrial",
        },
      },
    },
  },
  "sede-medellin": {
    name: "Sede Medellín",
    facultades: {
      minas: {
        name: "Facultad de Minas",
        programas: {
          "ingenieria-minas": "Ingeniería de Minas y Metalurgia",
          "ingenieria-geologica": "Ingeniería Geológica",
          "ingenieria-petroleos": "Ingeniería de Petróleos",
          "ingenieria-materiales": "Ingeniería de Materiales",
        },
      },
      ciencias: {
        name: "Facultad de Ciencias",
        programas: {
          biologia: "Biología",
          matematicas: "Matemáticas",
          fisica: "Física",
          quimica: "Química",
        },
      },
      "ciencias-agrarias": {
        name: "Facultad de Ciencias Agrarias",
        programas: {
          agronomia: "Ingeniería Agronómica",
          zootecnia: "Zootecnia",
          "ingenieria-forestal": "Ingeniería Forestal",
        },
      },
    },
  },
  "sede-manizales": {
    name: "Sede Manizales",
    facultades: {
      "ingenieria-arquitectura": {
        name: "Facultad de Ingeniería y Arquitectura",
        programas: {
          "ingenieria-civil": "Ingeniería Civil",
          "ingenieria-electronica": "Ingeniería Electrónica",
          arquitectura: "Arquitectura",
          "ingenieria-quimica": "Ingeniería Química",
        },
      },
      "ciencias-exactas": {
        name: "Facultad de Ciencias Exactas y Naturales",
        programas: {
          biologia: "Biología",
          matematicas: "Matemáticas",
          fisica: "Física",
          quimica: "Química",
        },
      },
      administracion: {
        name: "Facultad de Administración",
        programas: {
          "administracion-negocios": "Administración de Negocios",
          "gestion-cultural": "Gestión Cultural y Comunicativa",
        },
      },
    },
  },
  "sede-palmira": {
    name: "Sede Palmira",
    facultades: {
      "ciencias-agropecuarias": {
        name: "Facultad de Ciencias Agropecuarias",
        programas: {
          agronomia: "Ingeniería Agronómica",
          zootecnia: "Zootecnia",
          "ingenieria-agricola": "Ingeniería Agrícola",
        },
      },
      "ingenieria-administracion": {
        name: "Facultad de Ingeniería y Administración",
        programas: {
          "ingenieria-industrial": "Ingeniería Industrial",
          "administracion-empresas": "Administración de Empresas",
        },
      },
    },
  },
}

interface AcademicFilters {
  sede: string
  facultad: string
  programa: string
}

interface ConfigFilterButtonProps {
  variant?: "nav" | "sidebar"
  user?: User | null
  initialFilters?: AcademicFilters
  onFiltersChange?: (filters: AcademicFilters) => void
}

export default function ConfigFilterButton({
  variant = "nav",
  user,
  initialFilters = { sede: "", facultad: "", programa: "" },
  onFiltersChange,
}: ConfigFilterButtonProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [sedeOpen, setSedeOpen] = useState(false)
  const [facultadOpen, setFacultadOpen] = useState(false)
  const [programaOpen, setProgramaOpen] = useState(false)
  const [academicFilters, setAcademicFilters] =
    useState<AcademicFilters>(initialFilters)

  // Get available facultades based on selected sede
  const availableFacultades = useMemo(() => {
    if (!academicFilters.sede || !academicStructure[academicFilters.sede]) {
      return {}
    }
    return academicStructure[academicFilters.sede].facultades
  }, [academicFilters.sede])

  // Get available programas based on selected sede and facultad
  const availableProgramas = useMemo(() => {
    if (!academicFilters.sede || !academicFilters.facultad) {
      return {}
    }
    const sede = academicStructure[academicFilters.sede]
    const facultad = sede?.facultades[academicFilters.facultad]
    return facultad?.programas || {}
  }, [academicFilters.sede, academicFilters.facultad])

  // Update filters and notify parent
  const updateFilter = (key: keyof AcademicFilters, value: string) => {
    const newFilters = { ...academicFilters, [key]: value }
    setAcademicFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  if (!user) {
    return null
  }

  // Handle sede change - reset facultad and programa when sede changes
  const handleSedeChange = (value: string) => {
    const newFilters = { sede: value, facultad: "", programa: "" }
    setAcademicFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  // Handle facultad change - reset programa when facultad changes
  const handleFacultadChange = (value: string) => {
    const newFilters = { ...academicFilters, facultad: value, programa: "" }
    setAcademicFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  // Handle programa change
  const handleProgramaChange = (value: string) => {
    updateFilter("programa", value)
  }

  // Calculate active filters count
  const activeFiltersCount =
    Object.values(academicFilters).filter(Boolean).length

  // Format labels for display
  const formatLabel = (value: string) => {
    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Check if configuration is complete
  const isConfigComplete = activeFiltersCount >= 3

  // Get current selection display
  const getCurrentSelectionText = () => {
    if (!academicFilters.sede) return "Sin configurar"

    const parts = []
    if (academicFilters.sede) {
      parts.push(academicStructure[academicFilters.sede]?.name)
    }
    if (academicFilters.facultad) {
      parts.push(availableFacultades[academicFilters.facultad]?.name)
    }
    if (academicFilters.programa) {
      parts.push(availableProgramas[academicFilters.programa])
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
                  className={`w-full justify-between py-6 ${
                    !academicFilters.sede
                      ? "border-amber-300 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/50"
                      : ""
                  }`}
                >
                  {academicFilters.sede
                    ? academicStructure[academicFilters.sede]?.name
                    : "Selecciona tu sede"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar sede..." />
                  <CommandList>
                    <CommandEmpty>No se encontró ninguna sede.</CommandEmpty>
                    <CommandGroup>
                      {Object.entries(academicStructure).map(([key, sede]) => (
                        <CommandItem
                          key={key}
                          value={sede.name}
                          onSelect={() => {
                            handleSedeChange(key)
                            setSedeOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${academicFilters.sede === key ? "opacity-100" : "opacity-0"}`}
                          />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{sede.name}</span>
                            <span className="text-muted-foreground text-xs">
                              {Object.keys(sede.facultades).length} facultades
                              disponibles
                            </span>
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
                  disabled={!academicFilters.sede}
                  className={`w-full justify-between py-6 ${
                    !academicFilters.facultad && academicFilters.sede
                      ? "border-amber-300 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/50"
                      : ""
                  }`}
                >
                  {academicFilters.facultad
                    ? availableFacultades[academicFilters.facultad]?.name
                    : !academicFilters.sede
                      ? "Primero selecciona una sede"
                      : "Selecciona tu facultad"}
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
                      {Object.entries(availableFacultades).map(
                        ([key, facultad]) => (
                          <CommandItem
                            key={key}
                            value={facultad.name}
                            onSelect={() => {
                              handleFacultadChange(key)
                              setFacultadOpen(false)
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${academicFilters.facultad === key ? "opacity-100" : "opacity-0"}`}
                            />
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {facultad.name}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {Object.keys(facultad.programas).length}{" "}
                                programas disponibles
                              </span>
                            </div>
                          </CommandItem>
                        ),
                      )}
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
                  disabled={!academicFilters.facultad}
                  className={`w-full justify-between py-6 ${
                    !academicFilters.programa && academicFilters.facultad
                      ? "border-amber-300 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/50"
                      : ""
                  }`}
                >
                  {academicFilters.programa
                    ? availableProgramas[academicFilters.programa]
                    : !academicFilters.facultad
                      ? "Primero selecciona una facultad"
                      : "Selecciona tu programa"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar programa..." />
                  <CommandList>
                    <CommandEmpty>No se encontró ningún programa.</CommandEmpty>
                    <CommandGroup>
                      {Object.entries(availableProgramas).map(
                        ([key, programa]) => (
                          <CommandItem
                            key={key}
                            value={programa}
                            onSelect={() => {
                              handleProgramaChange(key)
                              setProgramaOpen(false)
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${academicFilters.programa === key ? "opacity-100" : "opacity-0"}`}
                            />
                            {programa}
                          </CommandItem>
                        ),
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={() => setOpen(false)} disabled={!isConfigComplete}>
          {isConfigComplete ? "Guardar" : "Completar configuración"}
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
                  !isConfigComplete
                    ? "animate-pulse border border-dashed border-amber-300 dark:border-amber-500"
                    : ""
                }
                tooltip={
                  !isConfigComplete
                    ? "Configura tu ubicación académica"
                    : "Configuración académica"
                }
              >
                <div
                  className={`relative flex aspect-square size-8 items-center justify-center rounded-lg ${
                    !isConfigComplete
                      ? "bg-amber-500 text-white dark:bg-amber-500"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <School className="size-4" />
                  {!isConfigComplete && (
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
                    {!isConfigComplete ? "Establecer sede" : "Mi sede"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {isConfigComplete
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
              !isConfigComplete
                ? "relative animate-pulse border border-dashed border-amber-300 bg-amber-500 text-white hover:bg-amber-500/90 dark:border-amber-500 dark:bg-amber-500 dark:hover:bg-amber-500/90"
                : ""
            }
            aria-label="Configuración académica"
          >
            <School size={16} />
            Mi sede
            {!isConfigComplete && (
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
      {showBadges && academicFilters.sede && (
        <Badge variant="secondary" className="text-xs">
          <School className="mr-1 size-3" />
          {academicStructure[academicFilters.sede]?.name}
        </Badge>
      )}
      {showBadges && academicFilters.facultad && (
        <Badge variant="secondary" className="text-xs">
          <University className="mr-1 size-3" />
          {availableFacultades[academicFilters.facultad]?.name}
        </Badge>
      )}
      {showBadges && academicFilters.programa && (
        <Badge variant="secondary" className="text-xs">
          <GraduationCap className="mr-1 size-3" />
          {availableProgramas[academicFilters.programa]}
        </Badge>
      )}
    </div>
  )
}
