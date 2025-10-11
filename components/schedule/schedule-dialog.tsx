"use client"

import { Loader2, Pencil, Plus, Save } from "lucide-react"
import { useState } from "react"
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
} from "@/lib/actions/schedule/schedules.actions"

import type { Schedules } from "@/types"

type ScheduleDialogProps = {
  categoryId: string
  categoryName: string
  schedule?: Schedules
  onSuccess?: () => void
}

export function ScheduleDialog({
  categoryId,
  categoryName,
  schedule,
  onSuccess,
}: ScheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(schedule?.name || "")
  const [description, setDescription] = useState(schedule?.description || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("El nombre es requerido")
      return
    }

    setLoading(true)

    try {
      if (schedule) {
        const updatedSchedule = {
          ...schedule,
          name: name.trim(),
          description: description.trim() || null,
        }
        const promise = updateSchedule(updatedSchedule)
        toast.promise(promise, {
          loading: "Actualizando horario...",
          success: "Horario actualizado correctamente",
          error: "Error al actualizar el horario",
        })
        await promise
      } else {
        const promise = createSchedule({
          name: name.trim(),
          description: description.trim() || null,
          category: categoryId as any,
        } as any)
        toast.promise(promise, {
          loading: "Creando horario...",
          success: "Horario creado correctamente",
          error: "Error al crear el horario",
        })
        await promise
      }

      setOpen(false)
      setName("")
      setDescription("")
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
