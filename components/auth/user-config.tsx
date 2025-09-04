"use client"

import {
  Check,
  ChevronsUpDown,
  GraduationCap,
  Loader2,
  MapPinned,
  School,
  University,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useId, useState } from "react"
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import { updateUserProfile } from "@/lib/actions/profiles.actions"
import { isAppwriteError } from "@/lib/utils/error-handler"

import type { Faculties, Programs, Sedes } from "@/types"

interface UserConfigDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UserConfigDialog({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: UserConfigDialogProps) {
  const { user } = useAuthContext()
  const {
    refreshConfig,
    selectedSede,
    selectedFaculty,
    selectedProgram,
    showConfigDialog,
    setShowConfigDialog,
  } = useAcademicConfig()
  const router = useRouter()
  const id = useId()

  // Dialog state - can be controlled externally or auto-managed
  const [internalOpen, setInternalOpen] = useState(false)
  const open =
    controlledOpen !== undefined
      ? controlledOpen
      : showConfigDialog || internalOpen
  const setOpen =
    controlledOnOpenChange ||
    ((newOpen: boolean) => {
      setInternalOpen(newOpen)
      if (!newOpen) {
        setShowConfigDialog(false)
      }
    })

  // Form state
  const [name, setName] = useState(user?.name || "")
  const [email] = useState(user?.email || "")

  // Academic selection state
  const [sedeOpen, setSedeOpen] = useState(false)
  const [facultyOpen, setFacultyOpen] = useState(false)
  const [programOpen, setProgramOpen] = useState(false)

  const [selectedSedeId, setSelectedSedeId] = useState(selectedSede?.$id || "")
  const [selectedFacultyId, setSelectedFacultyId] = useState(
    selectedFaculty?.$id || "",
  )
  const [selectedProgramId, setSelectedProgramId] = useState(
    selectedProgram?.$id || "",
  )

  // Data state
  const [sedes, setSedes] = useState<Sedes[]>([])
  const [faculties, setFaculties] = useState<Faculties[]>([])
  const [programs, setPrograms] = useState<Programs[]>([])

  // Loading state
  const [isSedesLoaded, setIsSedesLoaded] = useState(false)
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false)
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      // Reset form to current values
      setName(user?.name || "")
      setSelectedSedeId(selectedSede?.$id || "")
      setSelectedFacultyId(selectedFaculty?.$id || "")
      setSelectedProgramId(selectedProgram?.$id || "")
      setError(null)

      // Pre-load current academic data if available
      if (selectedSede && selectedFaculty) {
        setFaculties(selectedFaculty ? [selectedFaculty] : [])
      }
      if (selectedFaculty && selectedProgram) {
        setPrograms(selectedProgram ? [selectedProgram] : [])
      }
    }
  }

  const loadSedes = async () => {
    if (isSedesLoaded) return

    try {
      setError(null)
      const result = await getSedes()

      if (isAppwriteError(result)) {
        toast.error("Error cargando sedes", {
          description: result.message,
        })
        setError("Error cargando sedes")
        return
      }

      setSedes(result)
      setIsSedesLoaded(true)
    } catch (err) {
      console.error("Error loading sedes:", err)
      toast.error("Error cargando sedes")
      setError("Error cargando sedes")
    }
  }

  const handleSedeChange = async (sedeId: string) => {
    setSelectedSedeId(sedeId)
    setSelectedFacultyId("")
    setSelectedProgramId("")
    setPrograms([])

    if (sedeId) {
      try {
        setIsLoadingFaculties(true)
        const result = await getFacultiesBySede(sedeId)

        if (isAppwriteError(result)) {
          toast.error("Error cargando facultades", {
            description: result.message,
          })
          setError("Error cargando facultades")
          return
        }

        setFaculties(result)
      } catch (err) {
        console.error("Error loading facultades:", err)
        toast.error("Error cargando facultades")
        setError("Error cargando facultades")
      } finally {
        setIsLoadingFaculties(false)
      }
    } else {
      setFaculties([])
    }
  }

  const handleFacultyChange = async (facultyId: string) => {
    setSelectedFacultyId(facultyId)
    setSelectedProgramId("")

    if (facultyId) {
      try {
        setIsLoadingPrograms(true)
        const result = await getProgramsByFaculty(facultyId)

        if (isAppwriteError(result)) {
          toast.error("Error cargando programas", {
            description: result.message,
          })
          setError("Error cargando programas")
          return
        }

        setPrograms(result)
      } catch (err) {
        console.error("Error loading programas:", err)
        toast.error("Error cargando programas")
        setError("Error cargando programas")
      } finally {
        setIsLoadingPrograms(false)
      }
    } else {
      setPrograms([])
    }
  }

  const handleProgramChange = (programId: string) => {
    setSelectedProgramId(programId)
  }

  const saveUserConfig = async () => {
    if (!user?.$id) {
      throw new Error("Usuario no autenticado")
    }

    setIsSaving(true)
    try {
      // Update profile (academic configuration)
      const profileResult = await updateUserProfile({
        user_id: user.$id,
        sede_id: selectedSedeId || null,
        faculty_id: selectedFacultyId || null,
        program_id: selectedProgramId || null,
      })

      if (isAppwriteError(profileResult)) {
        throw new Error(
          profileResult.message || "Error guardando configuración",
        )
      }

      // TODO: Add user name update functionality here when available
      // For now, we'll just update the academic configuration

      await refreshConfig()
      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error("Error saving user config:", error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = () => {
    if (!user?.$id) {
      toast.error("Debes estar logueado para guardar")
      return
    }

    if (!selectedSedeId || !selectedFacultyId || !selectedProgramId) {
      toast.error("Selecciona sede, facultad y programa")
      return
    }

    toast.promise(saveUserConfig(), {
      loading: "Guardando configuración...",
      success: "Configuración guardada correctamente",
      error: (error: Error) => error.message,
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Configuración de Usuario
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Actualiza tu información personal y configuración académica.
        </DialogDescription>

        <div className="overflow-y-auto">
          <div className="px-6 pt-6 pb-6">
            {error && (
              <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                  <User className="size-4" />
                  Información Personal
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-name`}>Nombre completo</Label>
                    <Input
                      id={`${id}-name`}
                      placeholder="Tu nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${id}-email`}>Correo electrónico</Label>
                    <Input
                      id={`${id}-email`}
                      value={email}
                      type="email"
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-muted-foreground text-xs">
                      El correo electrónico no se puede cambiar
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Configuration Section */}
              <div className="space-y-4">
                <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                  <MapPinned className="size-4" />
                  Configuración Académica
                </div>

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
                        className="w-full justify-between"
                      >
                        {selectedSedeId
                          ? sedes.find((s) => s.$id === selectedSedeId)?.name ||
                            selectedSede?.name ||
                            "Sede no encontrada"
                          : "Selecciona tu sede"}
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
                                    selectedSedeId === sede.$id
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
                        disabled={!selectedSedeId || isLoadingFaculties}
                        className="w-full justify-between"
                      >
                        {isLoadingFaculties ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" />
                            Cargando facultades...
                          </div>
                        ) : selectedFacultyId ? (
                          faculties.find((f) => f.$id === selectedFacultyId)
                            ?.name ||
                          selectedFaculty?.name ||
                          "Facultad no encontrada"
                        ) : !selectedSedeId ? (
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
                                    selectedFacultyId === facultad.$id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                <span className="font-medium">
                                  {facultad.name}
                                </span>
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
                        disabled={!selectedFacultyId || isLoadingPrograms}
                        className="w-full justify-between"
                      >
                        {isLoadingPrograms ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" />
                            Cargando programas...
                          </div>
                        ) : selectedProgramId ? (
                          programs.find((p) => p.$id === selectedProgramId)
                            ?.name ||
                          selectedProgram?.name ||
                          "Programa no encontrado"
                        ) : !selectedFacultyId ? (
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
                          <CommandEmpty>
                            No se encontró ningún programa.
                          </CommandEmpty>
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
                                    selectedProgramId === programa.$id
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
            </form>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSaving}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSave}
            disabled={
              !selectedSedeId ||
              !selectedFacultyId ||
              !selectedProgramId ||
              isSaving
            }
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
