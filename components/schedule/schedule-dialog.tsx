"use client"

import { Loader2, Plus, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getFacultiesBySede,
  getProgramsByFaculty,
} from "@/lib/actions/academic.actions"
import {
  createSchedule,
  updateSchedule,
} from "@/lib/actions/schedule/schedules.actions"

import type { Faculties, Programs, Schedules } from "@/types"

type ScheduleDialogProps = {
  categoryId: string
  categoryName: string
  userSedeId: string
  schedule?: Schedules
  onSuccess?: () => void
}

export function ScheduleDialog({
  categoryId,
  categoryName,
  userSedeId,
  schedule,
  onSuccess,
}: ScheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(schedule?.name || "")

  const [faculties, setFaculties] = useState<Faculties[]>([])
  const [programs, setPrograms] = useState<Programs[]>([])

  const [selectedFaculty, setSelectedFaculty] = useState<string>(
    schedule?.faculty?.$id || "",
  )
  const [selectedProgram, setSelectedProgram] = useState<string>(
    schedule?.program?.$id || "",
  )

  useEffect(() => {
    const loadFaculties = async () => {
      const data = await getFacultiesBySede(userSedeId)
      setFaculties(data)
    }
    void loadFaculties()
  }, [userSedeId])

  useEffect(() => {
    if (selectedFaculty) {
      const loadPrograms = async () => {
        const data = await getProgramsByFaculty(selectedFaculty)
        setPrograms(data)
        if (!data.find((p) => p.$id === selectedProgram)) {
          setSelectedProgram("")
        }
      }
      void loadPrograms()
    } else {
      setPrograms([])
    }
  }, [selectedFaculty, selectedProgram])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("El nombre es requerido")
      return
    }

    if (!selectedFaculty || !selectedProgram) {
      toast.error("Debes seleccionar facultad y programa")
      return
    }

    setLoading(true)

    try {
      if (schedule) {
        toast.promise(
          updateSchedule(schedule.$id, {
            name: name.trim(),
            facultyId: selectedFaculty,
            programId: selectedProgram,
          }),
          {
            loading: "Actualizando horario...",
            success: "Horario actualizado correctamente",
            error: "Error al actualizar el horario",
          },
        )
      } else {
        toast.promise(
          createSchedule({
            name: name.trim(),
            categoryId,
            facultyId: selectedFaculty,
            programId: selectedProgram,
          }),
          {
            loading: "Creando horario...",
            success: "Horario creado correctamente",
            error: "Error al crear el horario",
          },
        )
      }

      setOpen(false)
      setName("")
      setSelectedFaculty("")
      setSelectedProgram("")
      onSuccess?.()
    } catch (error) {
      console.error("Error in schedule dialog:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {schedule ? (
          <Button variant="outline" size="sm">
            Editar
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Horario
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {schedule ? "Editar horario" : "Crear nuevo horario"}
          </DialogTitle>
          <DialogDescription>
            {schedule
              ? "Actualiza los datos del horario"
              : `Crea un nuevo horario para ${categoryName}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Ej: Primer Semestre 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty">Facultad</Label>
            <Select
              value={selectedFaculty}
              onValueChange={setSelectedFaculty}
              disabled={loading || faculties.length === 0}
            >
              <SelectTrigger id="faculty">
                <SelectValue placeholder="Selecciona una facultad" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.$id} value={faculty.$id}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">Programa</Label>
            <Select
              value={selectedProgram}
              onValueChange={setSelectedProgram}
              disabled={loading || !selectedFaculty || programs.length === 0}
            >
              <SelectTrigger id="program">
                <SelectValue placeholder="Selecciona un programa" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.$id} value={program.$id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {schedule ? "Actualizar" : "Crear"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
