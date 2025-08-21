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
import { useEffect, useId, useState } from "react"
import { toast } from "sonner"

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
  getFacultiesBySede,
  getProgramsByFaculty,
  getSedes,
} from "@/lib/actions/academic.actions"
import {
  getUserProfile,
  updateUserProfile,
} from "@/lib/actions/profile.actions"

import type { Faculties, Programs, Sedes } from "@/types"

interface ConfigFilterButtonProps {
  variant?: "nav" | "sidebar"
}

export default function ConfigFilterButton({
  variant = "nav",
}: ConfigFilterButtonProps) {
  const { user } = useAuthContext()
  const id = useId()
  const [open, setOpen] = useState(false)
  const [sedeOpen, setSedeOpen] = useState(false)
  const [facultadOpen, setFacultadOpen] = useState(false)
  const [programaOpen, setProgramaOpen] = useState(false)

  // Form state
  const [selectedSede, setSelectedSede] = useState("")
  const [selectedFacultad, setSelectedFacultad] = useState("")
  const [selectedPrograma, setSelectedPrograma] = useState("")

  // Data arrays
  const [sedes, setSedes] = useState<Sedes[]>([])
  const [facultades, setFacultades] = useState<Faculties[]>([])
  const [programas, setProgramas] = useState<Programs[]>([])

  // Loading states
  const [isLoadingSedes, setIsLoadingSedes] = useState(false)
  const [isLoadingFacultades, setIsLoadingFacultades] = useState(false)
  const [isLoadingProgramas, setIsLoadingProgramas] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Load initial data and user config
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoadingSedes(true)

        // Load sedes
        const sedesData = await getSedes()
        setSedes(sedesData)

        // Load user profile if logged in
        if (user?.$id) {
          const result = await getUserProfile(user.$id)
          if (result.success && result.profile) {
            const profile = result.profile

            if (profile.sede_id) {
              setSelectedSede(profile.sede_id)

              // Load facultades for the user's sede
              const facultadesData = await getFacultiesBySede(profile.sede_id)
              setFacultades(facultadesData)

              if (profile.faculty_id) {
                setSelectedFacultad(profile.faculty_id)

                // Load programas for the user's faculty
                const programasData = await getProgramsByFaculty(
                  profile.faculty_id,
                )
                setProgramas(programasData)

                if (profile.program_id) {
                  setSelectedPrograma(profile.program_id)
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading initial data:", err)
        setError("Error cargando datos")
      } finally {
        setIsLoadingSedes(false)
      }
    }

    void loadInitialData()
  }, [user?.$id])

  // Handle sede selection
  const handleSedeChange = async (sedeId: string) => {
    setSelectedSede(sedeId)
    setSelectedFacultad("")
    setSelectedPrograma("")
    setFacultades([])
    setProgramas([])

    if (sedeId) {
      try {
        setIsLoadingFacultades(true)
        const facultadesData = await getFacultiesBySede(sedeId)
        setFacultades(facultadesData)
      } catch (err) {
        console.error("Error loading facultades:", err)
        setError("Error cargando facultades")
      } finally {
        setIsLoadingFacultades(false)
      }
    }
  }

  // Handle facultad selection
  const handleFacultadChange = async (facultadId: string) => {
    setSelectedFacultad(facultadId)
    setSelectedPrograma("")
    setProgramas([])

    if (facultadId) {
      try {
        setIsLoadingProgramas(true)
        const programasData = await getProgramsByFaculty(facultadId)
        setProgramas(programasData)
      } catch (err) {
        console.error("Error loading programas:", err)
        setError("Error cargando programas")
      } finally {
        setIsLoadingProgramas(false)
      }
    }
  }

  // Handle programa selection
  const handleProgramaChange = (programaId: string) => {
    setSelectedPrograma(programaId)
  }

  // Save configuration
  const handleSave = async () => {
    if (!user?.$id) {
      toast.error("Debes estar logueado para guardar")
      return
    }

    if (!selectedSede || !selectedFacultad || !selectedPrograma) {
      toast.error("Selecciona sede, facultad y programa")
      return
    }

    try {
      setIsSaving(true)
      const result = await updateUserProfile({
        user_id: user.$id,
        sede_id: selectedSede,
        faculty_id: selectedFacultad,
        program_id: selectedPrograma,
      })

      if (result.success) {
        toast.success("Configuración guardada correctamente")
        setOpen(false)
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

  // Check if configuration is complete
  const isComplete = selectedSede && selectedFacultad && selectedPrograma

  // Get display text for current selection
  const getDisplayText = () => {
    if (!selectedSede) return "Sin configurar"

    const parts = []

    const sede = sedes.find((s) => s.$id === selectedSede)
    if (sede) parts.push(sede.name)

    const facultad = facultades.find((f) => f.$id === selectedFacultad)
    if (facultad) parts.push(facultad.name)

    const programa = programas.find((p) => p.$id === selectedPrograma)
    if (programa) parts.push(programa.name)

    return parts.join(" • ")
  }

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
          Configura tu sede, facultad y programa. Los cambios se guardan cuando
          presiones el botón Guardar.
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
          <Popover open={sedeOpen} onOpenChange={setSedeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={sedeOpen}
                disabled={isLoadingSedes}
                className={`w-full justify-between py-6 ${
                  !selectedSede
                    ? "border-amber-300 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/50"
                    : ""
                }`}
              >
                {isLoadingSedes ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Cargando sedes...
                  </div>
                ) : selectedSede ? (
                  sedes.find((s) => s.$id === selectedSede)?.name ||
                  "Sede no encontrada"
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
          <Popover open={facultadOpen} onOpenChange={setFacultadOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={facultadOpen}
                disabled={!selectedSede || isLoadingFacultades}
                className={`w-full justify-between py-6 ${
                  !selectedFacultad && selectedSede
                    ? "border-amber-300 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/50"
                    : ""
                }`}
              >
                {isLoadingFacultades ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Cargando facultades...
                  </div>
                ) : selectedFacultad ? (
                  facultades.find((f) => f.$id === selectedFacultad)?.name ||
                  "Facultad no encontrada"
                ) : !selectedSede ? (
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
                  <CommandEmpty>No se encontró ninguna facultad.</CommandEmpty>
                  <CommandGroup>
                    {facultades.map((facultad) => (
                      <CommandItem
                        key={facultad.$id}
                        value={facultad.name}
                        onSelect={() => {
                          void handleFacultadChange(facultad.$id)
                          setFacultadOpen(false)
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedFacultad === facultad.$id
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
          <Popover open={programaOpen} onOpenChange={setProgramaOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={programaOpen}
                disabled={!selectedFacultad || isLoadingProgramas}
                className={`w-full justify-between py-6 ${
                  !selectedPrograma && selectedFacultad
                    ? "border-amber-300 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/50"
                    : ""
                }`}
              >
                {isLoadingProgramas ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Cargando programas...
                  </div>
                ) : selectedPrograma ? (
                  programas.find((p) => p.$id === selectedPrograma)?.name ||
                  "Programa no encontrado"
                ) : !selectedFacultad ? (
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
                    {programas.map((programa) => (
                      <CommandItem
                        key={programa.$id}
                        value={programa.name}
                        onSelect={() => {
                          handleProgramaChange(programa.$id)
                          setProgramaOpen(false)
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedPrograma === programa.$id
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
            !selectedSede || !selectedFacultad || !selectedPrograma || isSaving
          }
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
            </>
          ) : (
            <>Guardar</>
          )}
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
                      ? getDisplayText()
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
