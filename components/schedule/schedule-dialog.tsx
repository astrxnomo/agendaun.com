"use client"

import { Loader2, Pencil, Plus } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  createSchedule,
  updateSchedule,
} from "@/lib/actions/schedule/schedules"

import type { ScheduleCategories, Schedules } from "@/lib/appwrite/types"

type ScheduleDialogProps = {
  category: ScheduleCategories
  schedule?: Schedules
}

export function ScheduleDialog({ category, schedule }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(schedule?.name || "")
  const [description, setDescription] = useState(schedule?.description || "")

  useEffect(() => {
    if (open && schedule) {
      setName(schedule.name || "")
      setDescription(schedule.description || "")
    } else if (open && !schedule) {
      setName("")
      setDescription("")
    }
  }, [open, schedule])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("El nombre es requerido")
      return
    }

    setLoading(true)

    const promise = schedule
      ? updateSchedule({
          ...schedule,
          name: name.trim(),
          description: description.trim() || null,
        })
      : createSchedule({
          name: name.trim(),
          description: description.trim() || null,
          category: category.$id as any,
        } as any)

    toast.promise(promise, {
      loading: schedule ? "Actualizando horario..." : "Creando horario...",
      success: schedule
        ? "Horario actualizado correctamente"
        : "Horario creado correctamente",
      error: "Error al guardar el horario",
    })

    try {
      await promise
      setOpen(false)
      setName("")
      setDescription("")
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
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar horario</span>
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
              : `Crea un nuevo horario para ${category.name}`}
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
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Describe brevemente este horario..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>{schedule ? "Actualizar" : "Crear"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
