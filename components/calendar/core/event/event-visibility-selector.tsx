"use client"

import {
  Check,
  ChevronsUpDown,
  Globe,
  GraduationCap,
  Loader2,
  School,
  University,
} from "lucide-react"
import { useEffect, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { getFacultiesBySede } from "@/lib/data/faculties/getFacultiesBySede"
import { getProgramsByFaculty } from "@/lib/data/programs/getProgramsByFaculty"
import { getSedes } from "@/lib/data/sedes/getSedes"
import { type Faculties, type Programs, type Sedes } from "@/lib/data/types"

interface EventVisibilitySelectorProps {
  value: "nacional" | "sede" | "faculty" | "program"
  onChange: (level: "nacional" | "sede" | "faculty" | "program") => void
  selectedSede: Sedes | null
  selectedFaculty: Faculties | null
  selectedProgram: Programs | null
  onSedeChange: (sede: Sedes | null) => void
  onFacultyChange: (faculty: Faculties | null) => void
  onProgramChange: (program: Programs | null) => void
}

export function EventVisibilitySelector({
  value,
  onChange,
  selectedSede,
  selectedFaculty,
  selectedProgram,
  onSedeChange,
  onFacultyChange,
  onProgramChange,
}: EventVisibilitySelectorProps) {
  const id = useId()

  const [sedes, setSedes] = useState<Sedes[]>([])
  const [faculties, setFaculties] = useState<Faculties[]>([])
  const [programs, setPrograms] = useState<Programs[]>([])

  const [sedeOpen, setSedeOpen] = useState(false)
  const [facultyOpen, setFacultyOpen] = useState(false)
  const [programOpen, setProgramOpen] = useState(false)

  const [isSedesLoaded, setIsSedesLoaded] = useState(false)
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false)
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false)

  // Cargar sedes cuando se abre el selector
  const loadSedes = async () => {
    if (isSedesLoaded) return

    try {
      const sedesData = await getSedes()
      setSedes(sedesData)
      setIsSedesLoaded(true)
    } catch (error) {
      console.error("Error loading sedes:", error)
    }
  }

  // Cargar sedes automáticamente si hay una sede pre-seleccionada (modo edición)
  useEffect(() => {
    if (selectedSede && !isSedesLoaded) {
      void loadSedes()
    }
  }, [selectedSede, isSedesLoaded])

  // Cargar facultades cuando cambia la sede seleccionada
  useEffect(() => {
    if (selectedSede) {
      const loadFaculties = async () => {
        setIsLoadingFaculties(true)
        try {
          const facultiesData = await getFacultiesBySede(selectedSede.$id)
          setFaculties(facultiesData)
        } catch (error) {
          console.error("Error loading faculties:", error)
        } finally {
          setIsLoadingFaculties(false)
        }
      }
      loadFaculties()
    } else {
      setFaculties([])
    }
  }, [selectedSede])

  // Cargar programas cuando cambia la facultad seleccionada
  useEffect(() => {
    if (selectedFaculty) {
      const loadPrograms = async () => {
        setIsLoadingPrograms(true)
        try {
          const programsData = await getProgramsByFaculty(selectedFaculty.$id)
          setPrograms(programsData)
        } catch (error) {
          console.error("Error loading programs:", error)
        } finally {
          setIsLoadingPrograms(false)
        }
      }
      loadPrograms()
    } else {
      setPrograms([])
    }
  }, [selectedFaculty])

  const handleLevelChange = (newLevel: string) => {
    const level = newLevel as typeof value
    onChange(level)

    if (level === "nacional") {
      onSedeChange(null)
      onFacultyChange(null)
      onProgramChange(null)
    } else if (level === "sede") {
      onFacultyChange(null)
      onProgramChange(null)
    } else if (level === "faculty") {
      onProgramChange(null)
    }
  }

  const handleSedeChange = (sede: Sedes) => {
    onSedeChange(sede)
    onFacultyChange(null)
    onProgramChange(null)
  }

  const handleFacultyChange = (faculty: Faculties) => {
    onFacultyChange(faculty)
    onProgramChange(null)
  }

  return (
    <div className="space-y-4">
      {/* Radio Group para nivel */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Visibilidad *</Label>
        <RadioGroup
          className="mt-2 grid grid-cols-4 gap-2"
          value={value}
          onValueChange={handleLevelChange}
        >
          {/* Nacional */}
          <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
            <RadioGroupItem
              id={`${id}-nacional`}
              value="nacional"
              className="sr-only"
            />
            <Globe className="opacity-60" size={20} aria-hidden="true" />
            <label
              htmlFor={`${id}-nacional`}
              className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
            >
              Nacional
            </label>
          </div>

          {/* Sede */}
          <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
            <RadioGroupItem
              id={`${id}-sede`}
              value="sede"
              className="sr-only"
            />
            <School className="opacity-60" size={20} aria-hidden="true" />
            <label
              htmlFor={`${id}-sede`}
              className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
            >
              Sede
            </label>
          </div>

          {/* Facultad */}
          <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
            <RadioGroupItem
              id={`${id}-faculty`}
              value="faculty"
              className="sr-only"
            />
            <University className="opacity-60" size={20} aria-hidden="true" />
            <label
              htmlFor={`${id}-faculty`}
              className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
            >
              Facultad
            </label>
          </div>

          {/* Programa */}
          <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
            <RadioGroupItem
              id={`${id}-program`}
              value="program"
              className="sr-only"
            />
            <GraduationCap
              className="opacity-60"
              size={20}
              aria-hidden="true"
            />
            <label
              htmlFor={`${id}-program`}
              className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
            >
              Programa
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Select para Sede */}
      {(value === "sede" || value === "faculty" || value === "program") && (
        <div className="space-y-2">
          <Label
            htmlFor={`${id}-sede-select`}
            className="flex items-center text-sm font-medium"
          >
            <School className="mr-1 size-4" />
            Sede *
          </Label>
          <Popover
            open={sedeOpen}
            onOpenChange={(open) => {
              setSedeOpen(open)
              if (open) {
                void loadSedes()
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={sedeOpen}
                className="w-full justify-between"
              >
                {selectedSede
                  ? selectedSede.name || "Sede no encontrada"
                  : "Selecciona una sede"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                {/* <CommandInput placeholder="Buscar sede..." /> */}
                <CommandList>
                  <CommandEmpty>
                    {!isSedesLoaded
                      ? "Cargando sedes..."
                      : "No se encontró ninguna sede."}
                  </CommandEmpty>
                  <CommandGroup>
                    {sedes.map((sede) => (
                      <CommandItem
                        key={sede.$id}
                        value={sede.name}
                        onSelect={() => {
                          handleSedeChange(sede)
                          setSedeOpen(false)
                        }}
                      >
                        <Check
                          className={`h-4 w-4 ${
                            selectedSede?.$id === sede.$id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        <span className="font-medium">{sede.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Select para Facultad */}
      {(value === "faculty" || value === "program") && selectedSede && (
        <div className="space-y-2">
          <Label
            htmlFor={`${id}-faculty-select`}
            className="flex items-center text-sm font-medium"
          >
            <University className="mr-1 size-4" />
            Facultad *
          </Label>
          <Popover open={facultyOpen} onOpenChange={setFacultyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={facultyOpen}
                disabled={!selectedSede || isLoadingFaculties}
                className="w-full justify-between"
              >
                {isLoadingFaculties ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Cargando facultades...
                  </div>
                ) : selectedFaculty ? (
                  selectedFaculty.name || "Facultad no encontrada"
                ) : !selectedSede ? (
                  "Primero selecciona una sede"
                ) : (
                  "Selecciona una facultad"
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                {/* <CommandInput placeholder="Buscar facultad..." /> */}
                <CommandList>
                  <CommandEmpty>No se encontró ninguna facultad.</CommandEmpty>
                  <CommandGroup>
                    {faculties.map((faculty) => (
                      <CommandItem
                        key={faculty.$id}
                        value={faculty.name}
                        onSelect={() => {
                          handleFacultyChange(faculty)
                          setFacultyOpen(false)
                        }}
                      >
                        <Check
                          className={`h-4 w-4 ${
                            selectedFaculty?.$id === faculty.$id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        <span className="font-medium">{faculty.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Select para Programa */}
      {value === "program" && selectedFaculty && (
        <div className="space-y-2">
          <Label
            htmlFor={`${id}-program-select`}
            className="flex items-center text-sm font-medium"
          >
            <GraduationCap className="mr-1 size-4" />
            Programa *
          </Label>
          <Popover open={programOpen} onOpenChange={setProgramOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={programOpen}
                disabled={!selectedFaculty || isLoadingPrograms}
                className="w-full justify-between"
              >
                {isLoadingPrograms ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Cargando programas...
                  </div>
                ) : selectedProgram ? (
                  selectedProgram.name || "Programa no encontrado"
                ) : !selectedFaculty ? (
                  "Primero selecciona una facultad"
                ) : (
                  "Selecciona un programa"
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                {/* <CommandInput placeholder="Buscar programa..." /> */}
                <CommandList>
                  <CommandEmpty>No se encontró ningún programa.</CommandEmpty>
                  <CommandGroup>
                    {programs.map((program) => (
                      <CommandItem
                        key={program.$id}
                        value={program.name}
                        onSelect={() => {
                          onProgramChange(program)
                          setProgramOpen(false)
                        }}
                      >
                        <Check
                          className={`h-4 w-4 ${
                            selectedProgram?.$id === program.$id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {program.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}
