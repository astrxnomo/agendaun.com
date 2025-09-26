"use client"

import {
  Check,
  ChevronsUpDown,
  GraduationCap,
  Loader2,
  Mail,
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
import { Separator } from "@/components/ui/separator"
import { useAuthContext } from "@/contexts/auth-context"
import {
  getFacultiesBySede,
  getProgramsByFaculty,
  getSedes,
} from "@/lib/actions/academic.actions"
import { updateProfile } from "@/lib/actions/profiles.actions"
import { updateUserName } from "@/lib/actions/users.actions"

import type { Faculties, Profiles, Programs, Sedes } from "@/types"

interface UserConfigDialogProps {
  children: React.ReactNode
}

export function ConfigDialog({ children }: UserConfigDialogProps) {
  const { user, profile, refreshAuth } = useAuthContext()
  const router = useRouter()
  const id = useId()

  const [open, setOpen] = useState(false)

  const [name, setName] = useState(user?.name || "")
  const [email] = useState(user?.email || "")

  const [sedeOpen, setSedeOpen] = useState(false)
  const [facultyOpen, setFacultyOpen] = useState(false)
  const [programOpen, setProgramOpen] = useState(false)

  const [selectedSede, setSelectedSede] = useState<Sedes | null>(
    profile?.sede || null,
  )
  const [selectedFaculty, setSelectedFaculty] = useState<Faculties | null>(
    profile?.faculty || null,
  )
  const [selectedProgram, setSelectedProgram] = useState<Programs | null>(
    profile?.program || null,
  )

  const [sedes, setSedes] = useState<Sedes[]>([])
  const [faculties, setFaculties] = useState<Faculties[]>([])
  const [programs, setPrograms] = useState<Programs[]>([])

  const [isSedesLoaded, setIsSedesLoaded] = useState(false)
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false)
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setName(user?.name || "")
      setSelectedSede(profile?.sede || null)
      setSelectedFaculty(profile?.faculty || null)
      setSelectedProgram(profile?.program || null)
      setError(null)

      if (profile?.sede && profile?.faculty) {
        setFaculties(profile?.faculty ? [profile?.faculty] : [])
      }
      if (profile?.faculty && profile?.program) {
        setPrograms(profile?.program ? [profile?.program] : [])
      }
    }
  }

  const loadSedes = async () => {
    if (isSedesLoaded) return

    try {
      setError(null)
      const result = await getSedes()
      setSedes(result)
      setIsSedesLoaded(true)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error cargando sedes"
      toast.error(errorMessage)
      setError(errorMessage)
    }
  }

  const handleSedeChange = async (sede: Sedes) => {
    setSelectedSede(sede)
    setSelectedFaculty(null)
    setSelectedProgram(null)
    setPrograms([])

    if (sede) {
      try {
        setIsLoadingFaculties(true)
        const result = await getFacultiesBySede(sede.$id)
        setFaculties(result)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error cargando facultades"
        toast.error(errorMessage)
        setError(errorMessage)
      } finally {
        setIsLoadingFaculties(false)
      }
    } else {
      setFaculties([])
    }
  }

  const handleFacultyChange = async (faculty: Faculties) => {
    setSelectedFaculty(faculty)
    setSelectedProgram(null)

    if (faculty) {
      try {
        setIsLoadingPrograms(true)
        const result = await getProgramsByFaculty(faculty.$id)
        setPrograms(result)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error cargando programas"
        toast.error(errorMessage)
        setError(errorMessage)
      } finally {
        setIsLoadingPrograms(false)
      }
    } else {
      setPrograms([])
    }
  }

  const handleProgramChange = (program: Programs) => {
    setSelectedProgram(program)
  }

  const saveUserConfig = async () => {
    if (!user?.$id) {
      throw new Error("Usuario no autenticado")
    }

    if (!selectedSede || !selectedFaculty || !selectedProgram) {
      throw new Error("Selecciona sede, facultad y programa")
    }

    if (!name.trim()) {
      throw new Error("El nombre es requerido")
    }

    setIsSaving(true)
    try {
      if (name.trim() !== user.name) {
        await updateUserName(name.trim())
      }

      await updateProfile({
        $id: profile?.$id || "",
        user_id: user.$id,
        sede: selectedSede,
        faculty: selectedFaculty,
        program: selectedProgram,
      } as Profiles)

      // Refresh both user and profile data from server
      await refreshAuth()
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
    if (!name.trim()) {
      toast.error("El nombre es requerido")
      return
    }

    if (!selectedSede || !selectedFaculty || !selectedProgram) {
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

            <form className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`${id}-name`}
                    className="flex items-center text-sm font-medium"
                  >
                    <User className="mr-1 size-4" />
                    Nombre
                  </Label>
                  <Input
                    id={`${id}-name`}
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${id}-email`}
                    className="flex items-center text-sm font-medium"
                  >
                    <Mail className="mr-1 size-4" />
                    Correo electrónico
                  </Label>
                  <Input
                    id={`${id}-email`}
                    value={email}
                    type="email"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <Separator />

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
                      {selectedSede
                        ? selectedSede.name || "Sede no encontrada"
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
                                void handleSedeChange(sede)
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
                                void handleFacultyChange(facultad)
                                setFacultyOpen(false)
                              }}
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  selectedFaculty?.$id === facultad.$id
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
                                handleProgramChange(programa)
                                setProgramOpen(false)
                              }}
                            >
                              <Check
                                className={`h-4 w-4 ${
                                  selectedProgram?.$id === programa.$id
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
              !name.trim() ||
              !selectedSede ||
              !selectedFaculty ||
              !selectedProgram ||
              isSaving
            }
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
