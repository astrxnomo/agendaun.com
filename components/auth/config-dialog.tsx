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
import { useActionState, useEffect, useId, useState } from "react"
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
  ProfileConfigState,
  saveProfileConfig,
} from "@/lib/actions/profile/profile-config"
import { getFacultiesBySede } from "@/lib/data/faculties/getFacultiesBySede"
import { getProgramsByFaculty } from "@/lib/data/programs/getProgramsByFaculty"
import { getSedes } from "@/lib/data/sedes/getSedes"
import { type Faculties, type Programs, type Sedes } from "@/lib/data/types"

interface UserConfigDialogProps {
  children: React.ReactNode
}

const initialState: ProfileConfigState = {
  success: false,
  message: "",
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

  const [error, setError] = useState<string | null>(null)

  const [state, formAction, isPending] = useActionState(
    saveProfileConfig,
    initialState,
  )

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setName(user?.name || "")
      setSelectedSede(profile?.sede || null)
      setSelectedFaculty(profile?.faculty || null)
      setSelectedProgram(profile?.program || null)
      setError(null)

      // Si hay una facultad seleccionada, cargar las facultades disponibles
      if (profile?.sede && profile?.faculty) {
        const loadFacultiesForProfile = async () => {
          try {
            setIsLoadingFaculties(true)
            const result = await getFacultiesBySede(profile.sede.$id)
            setFaculties(result)
          } catch (error) {
            console.error("Error loading faculties:", error)
            // Fallback: al menos mostrar la facultad actual
            setFaculties(profile.faculty ? [profile.faculty] : [])
          } finally {
            setIsLoadingFaculties(false)
          }
        }
        void loadFacultiesForProfile()
      }

      // Si hay un programa seleccionado, cargar los programas disponibles
      if (profile?.faculty && profile?.program) {
        const loadProgramsForProfile = async () => {
          try {
            setIsLoadingPrograms(true)
            const result = await getProgramsByFaculty(profile.faculty.$id)
            setPrograms(result)
          } catch (error) {
            console.error("Error loading programs:", error)
            // Fallback: al menos mostrar el programa actual
            setPrograms(profile.program ? [profile.program] : [])
          } finally {
            setIsLoadingPrograms(false)
          }
        }
        void loadProgramsForProfile()
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

  // Manejar respuestas del estado
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
        refreshAuth()
        router.refresh()
        setOpen(false)
      } else if (!state.success && !state.errors) {
        toast.error(state.message)
      }
    }
  }, [state, refreshAuth, router])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Mi cuenta
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

            <form
              action={formAction}
              id={`${id}-config-form`}
              className="space-y-4"
            >
              {/* Campos ocultos */}
              <input type="hidden" name="userId" value={user?.$id || ""} />
              <input
                type="hidden"
                name="profileId"
                value={profile?.$id || ""}
              />
              <input
                type="hidden"
                name="currentUserName"
                value={user?.name || ""}
              />
              <input
                type="hidden"
                name="sede"
                value={selectedSede?.$id || ""}
              />
              <input
                type="hidden"
                name="faculty"
                value={selectedFaculty?.$id || ""}
              />
              <input
                type="hidden"
                name="program"
                value={selectedProgram?.$id || ""}
              />

              {/* Errores generales */}
              {state.errors?._form && (
                <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
                  {state.errors._form.join(", ")}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={`${id}-name`}
                      className="flex items-center text-sm font-medium"
                    >
                      <User className="mr-1 size-4" />
                      Nombre
                    </Label>
                    <span className="text-muted-foreground text-xs">
                      {name.length}/50
                    </span>
                  </div>
                  <Input
                    id={`${id}-name`}
                    name="name"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 50))}
                    type="text"
                    maxLength={50}
                    disabled={isPending}
                    aria-invalid={state.errors?.name ? "true" : "false"}
                    aria-describedby={
                      state.errors?.name ? "name-error" : undefined
                    }
                  />
                  {state.errors?.name && (
                    <p id="name-error" className="text-destructive text-sm">
                      {state.errors.name.join(", ")}
                    </p>
                  )}
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
                      aria-invalid={state.errors?.sede ? "true" : "false"}
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
                {state.errors?.sede && (
                  <p className="text-destructive text-sm">
                    {state.errors.sede.join(", ")}
                  </p>
                )}
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
                {state.errors?.faculty && (
                  <p className="text-destructive text-sm">
                    {state.errors.faculty.join(", ")}
                  </p>
                )}
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
                {state.errors?.program && (
                  <p className="text-destructive text-sm">
                    {state.errors.program.join(", ")}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form={`${id}-config-form`}
            disabled={!name.trim() || !selectedSede || isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
