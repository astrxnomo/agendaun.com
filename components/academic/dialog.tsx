"use client"

import {
  Check,
  ChevronsUpDown,
  GraduationCap,
  Loader2,
  MapPinned,
  School,
  University,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useId, useState } from "react"
import { toast } from "sonner"

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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAcademicConfig } from "@/contexts/academic-context"
import { useAuthContext } from "@/contexts/auth-context"
import {
  getFacultiesBySede,
  getProgramsByFaculty,
  getSedes,
} from "@/lib/actions/academic.actions"
import { updateUserProfile } from "@/lib/actions/profile.actions"

import type { Faculties, Programs, Sedes } from "@/types"

export function ConfigDialog() {
  const { user } = useAuthContext()
  const { refreshConfig } = useAcademicConfig()
  const router = useRouter()
  const id = useId()

  const [sedeOpen, setSedeOpen] = useState(false)
  const [facultyOpen, setFacultyOpen] = useState(false)
  const [programOpen, setProgramOpen] = useState(false)

  const [selectedSede, setSelectedSede] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")

  const [sedes, setSedes] = useState<Sedes[]>([])
  const [faculties, setFaculties] = useState<Faculties[]>([])
  const [programs, setPrograms] = useState<Programs[]>([])

  const [isSedesLoaded, setIsSedesLoaded] = useState(false)
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false)
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setSelectedSede("")
    setSelectedFaculty("")
    setSelectedProgram("")
    setFaculties([])
    setPrograms([])
    setError(null)
  }

  useEffect(() => {
    resetForm()
  }, [])

  const loadSedes = async () => {
    if (isSedesLoaded) return

    try {
      setError(null)
      const sedes = await getSedes()
      setSedes(sedes)
      setIsSedesLoaded(true)
    } catch (err) {
      console.error("Error loading sedes:", err)
      setError("Error cargando sedes")
    }
  }

  const handleSedeChange = async (sedeId: string) => {
    setSelectedSede(sedeId)
    setSelectedFaculty("")
    setSelectedProgram("")
    setFaculties([])
    setPrograms([])

    if (sedeId) {
      try {
        setIsLoadingFaculties(true)
        const faculties = await getFacultiesBySede(sedeId)
        setFaculties(faculties)
      } catch (err) {
        console.error("Error loading facultades:", err)
        setError("Error cargando facultades")
      } finally {
        setIsLoadingFaculties(false)
      }
    }
  }

  const handleFacultyChange = async (facultyId: string) => {
    setSelectedFaculty(facultyId)
    setSelectedProgram("")
    setPrograms([])

    if (facultyId) {
      try {
        setIsLoadingPrograms(true)
        const programs = await getProgramsByFaculty(facultyId)
        setPrograms(programs)
      } catch (err) {
        console.error("Error loading programas:", err)
        setError("Error cargando programas")
      } finally {
        setIsLoadingPrograms(false)
      }
    }
  }

  const handleProgramChange = (programId: string) => {
    setSelectedProgram(programId)
  }

  const handleSave = async () => {
    if (!user?.$id) {
      toast.error("Debes estar logueado para guardar")
      return
    }

    if (!selectedSede || !selectedFaculty || !selectedProgram) {
      toast.error("Selecciona sede, facultad y programa")
      return
    }

    try {
      setIsSaving(true)
      const result = await updateUserProfile({
        user_id: user.$id,
        sede_id: selectedSede,
        faculty_id: selectedFaculty,
        program_id: selectedProgram,
      })

      if (result.success) {
        toast.success("Configuración guardada correctamente")
        await refreshConfig()
        router.refresh()
      } else {
        toast.error("Error guardando configuración")
      }
    } catch (err) {
      console.error("Error saving config:", err)
      toast.error("Error guardando configuración")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
            <MapPinned className="size-4" />
          </div>
          Configuración Académica
        </DialogTitle>
        <DialogDescription>
          Busca y selecciona tu sede, facultad y programa académico.
        </DialogDescription>
      </DialogHeader>

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Sede */}
        <div className="space-y-2">
          <Label
            htmlFor={`${id}-sede`}
            className="flex items-center text-sm font-medium"
          >
            <School className="mr-1 size-4" />
            Sede
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
                className="w-full justify-between py-6"
              >
                {selectedSede
                  ? sedes.find((s) => s.$id === selectedSede)?.name ||
                    "Sede no encontrada"
                  : "Busca y selecciona tu sede"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar sede..." />
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
                          void handleSedeChange(sede.$id)
                          setSedeOpen(false)
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedSede === sede.$id
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

        {/* Facultad */}
        <div className="space-y-2">
          <Label
            htmlFor={`${id}-facultad`}
            className="flex items-center text-sm font-medium"
          >
            <University className="mr-1 size-4" />
            Facultad
          </Label>
          <Popover open={facultyOpen} onOpenChange={setFacultyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={facultyOpen}
                disabled={!selectedSede || isLoadingFaculties}
                className={`w-full justify-between py-6 ${
                  !selectedFaculty && selectedSede
                    ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/50"
                    : ""
                }`}
              >
                {isLoadingFaculties ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Cargando facultades...
                  </div>
                ) : selectedFaculty ? (
                  faculties.find((f) => f.$id === selectedFaculty)?.name ||
                  "Facultad no encontrada"
                ) : !selectedSede ? (
                  "Primero selecciona una sede"
                ) : (
                  "Busca y selecciona tu facultad"
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar facultad..." />
                <CommandList>
                  <CommandEmpty>No se encontró ninguna facultad.</CommandEmpty>
                  <CommandGroup>
                    {faculties.map((facultad) => (
                      <CommandItem
                        key={facultad.$id}
                        value={facultad.name}
                        onSelect={() => {
                          void handleFacultyChange(facultad.$id)
                          setFacultyOpen(false)
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedFaculty === facultad.$id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        <span className="font-medium">{facultad.name}</span>
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
          <Popover open={programOpen} onOpenChange={setProgramOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={programOpen}
                disabled={!selectedFaculty || isLoadingPrograms}
                className={`w-full justify-between py-6 ${
                  !selectedProgram && selectedFaculty
                    ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/50"
                    : ""
                }`}
              >
                {isLoadingPrograms ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Cargando programas...
                  </div>
                ) : selectedProgram ? (
                  programs.find((p) => p.$id === selectedProgram)?.name ||
                  "Programa no encontrado"
                ) : !selectedFaculty ? (
                  "Primero selecciona una facultad"
                ) : (
                  "Busca y selecciona tu programa"
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
                    {programs.map((programa) => (
                      <CommandItem
                        key={programa.$id}
                        value={programa.name}
                        onSelect={() => {
                          handleProgramChange(programa.$id)
                          setProgramOpen(false)
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedProgram === programa.$id
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

      <DialogFooter>
        <Button
          onClick={handleSave}
          disabled={
            !selectedSede || !selectedFaculty || !selectedProgram || isSaving
          }
        >
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>Guardar</>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
