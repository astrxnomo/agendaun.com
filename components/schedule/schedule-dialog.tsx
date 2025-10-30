"use client"

import { Loader2, Pencil, Plus } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
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
  saveSchedule,
  type ScheduleActionState,
} from "@/lib/actions/schedule/schedules"

import type { ScheduleCategories, Schedules } from "@/lib/data/types"

const initialState: ScheduleActionState = {
  success: false,
  message: "",
}

type ScheduleDialogProps = {
  category: ScheduleCategories
  schedule?: Schedules
}

export function ScheduleDialog({ category, schedule }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(schedule?.name || "")
  const [description, setDescription] = useState(schedule?.description || "")

  const [state, formAction, isPending] = useActionState(
    saveSchedule,
    initialState,
  )

  useEffect(() => {
    if (open && schedule) {
      setName(schedule.name || "")
      setDescription(schedule.description || "")
    } else if (open && !schedule) {
      setName("")
      setDescription("")
    }
  }, [open, schedule])

  useEffect(() => {
    if (state.message) {
      if (state.success && state.data) {
        toast.success(state.message)
        setOpen(false)
        setName("")
        setDescription("")
      } else if (!state.success && !state.errors) {
        toast.error(state.message)
      }
    }
  }, [state])

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
        <form action={formAction} className="space-y-4">
          {/* Campos ocultos */}
          <input type="hidden" name="category" value={category.$id} />
          {schedule?.$id && (
            <input type="hidden" name="scheduleId" value={schedule.$id} />
          )}

          {/* Errores generales */}
          {state.errors?._form && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
              {state.errors._form.join(", ")}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Nombre *</Label>
              <span className="text-muted-foreground text-xs">
                {name.length}/100
              </span>
            </div>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Primer Semestre 2025"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 100))}
              disabled={isPending}
              maxLength={100}
              aria-invalid={state.errors?.name ? "true" : "false"}
              aria-describedby={state.errors?.name ? "name-error" : undefined}
            />
            {state.errors?.name && (
              <p id="name-error" className="text-destructive text-sm">
                {state.errors.name.join(", ")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Descripción</Label>
              <span className="text-muted-foreground text-xs">
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe brevemente este horario..."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              disabled={isPending}
              rows={3}
              maxLength={500}
              aria-invalid={state.errors?.description ? "true" : "false"}
              aria-describedby={
                state.errors?.description ? "description-error" : undefined
              }
            />
            {state.errors?.description && (
              <p id="description-error" className="text-destructive text-sm">
                {state.errors.description.join(", ")}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
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
