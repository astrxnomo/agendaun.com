"use client"

import { Check, Pencil, Plus, Trash2, X } from "lucide-react"
import { useActionState, useEffect, useRef, useState } from "react"
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
import {
  deleteEtiquetteAction,
  saveEtiquette,
  type EtiquetteActionState,
} from "@/lib/actions/calendar/etiquettes"
import {
  Colors,
  type CalendarEtiquettes,
  type Calendars,
} from "@/lib/data/types"
import { cn, getColorIndicator } from "@/lib/utils"

const initialState: EtiquetteActionState = {
  success: false,
  message: "",
}

interface EtiquettesManagerProps {
  calendar: Calendars
  onCalendarUpdate?: (updatedCalendar: Calendars) => void
  onEtiquetteUpdate?: (updatedEtiquette: CalendarEtiquettes) => void
  onEtiquetteDelete?: (deletedEtiquetteId: string) => void
}

export function EtiquettesManager({
  calendar,
  onCalendarUpdate,
  onEtiquetteUpdate,
  onEtiquetteDelete,
}: EtiquettesManagerProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState<Colors>("" as Colors)

  // Usar ref para evitar incluir calendar en las dependencias
  const calendarRef = useRef(calendar)
  calendarRef.current = calendar

  const [state, formAction, isPending] = useActionState(
    saveEtiquette,
    initialState,
  )

  useEffect(() => {
    if (state.message) {
      if (state.success && state.data) {
        const currentCalendar = calendarRef.current
        const isNewEtiquette = !currentCalendar.etiquettes.some(
          (e) => e.$id === state.data!.$id,
        )

        // Actualizar el calendario padre con la nueva lista de etiquettes
        if (onCalendarUpdate) {
          const updatedEtiquettes = isNewEtiquette
            ? [...currentCalendar.etiquettes, state.data]
            : currentCalendar.etiquettes.map((e) =>
                e.$id === state.data!.$id ? state.data! : e,
              )

          onCalendarUpdate({
            ...currentCalendar,
            etiquettes: updatedEtiquettes,
          })
        }

        // Notificar sobre la etiqueta actualizada para que actualice los eventos
        if (onEtiquetteUpdate && !isNewEtiquette) {
          onEtiquetteUpdate(state.data)
        }

        toast.success(state.message)
        setEditingId(null)
        setNewName("")
        setNewColor("" as Colors)
      } else if (!state.success && !state.errors) {
        toast.error(state.message)
      }
    }
  }, [state, onCalendarUpdate, onEtiquetteUpdate])

  const getAvailableColors = () => {
    const usedColors = calendar.etiquettes
      .filter((etiquette) => etiquette.$id !== editingId)
      .map((etiquette) => etiquette.color)

    return Object.values(Colors).filter(
      (color) => !usedColors.includes(color) && color !== Colors.GRAY,
    )
  }

  const startEdit = (etiquette: CalendarEtiquettes) => {
    setEditingId(etiquette.$id)
    setNewName(etiquette.name)
    setNewColor(etiquette.color)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewName("")
    setNewColor("" as Colors)
  }

  const handleDelete = async (etiquette: CalendarEtiquettes) => {
    const result = await deleteEtiquetteAction(etiquette.$id)

    if (result.success) {
      toast.success(`Etiqueta "${etiquette.name}" eliminada`)
      
      // Actualizar el calendario padre sin reload
      if (onCalendarUpdate) {
        const currentCalendar = calendarRef.current
        const updatedEtiquettes = currentCalendar.etiquettes.filter(
          (e) => e.$id !== etiquette.$id,
        )
        onCalendarUpdate({
          ...currentCalendar,
          etiquettes: updatedEtiquettes,
        })
      }

      // Notificar sobre la eliminación para limpiar eventos
      if (onEtiquetteDelete) {
        onEtiquetteDelete(etiquette.$id)
      }
    } else {
      toast.error(result.message)
    }
  }

  const availableColors = getAvailableColors()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Etiquetas</DialogTitle>
          <DialogDescription>
            Organiza tus eventos con etiquetas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Lista de etiquetas */}
          {calendar.etiquettes.map((etiquette) => (
            <div
              key={etiquette.$id}
              className={cn(
                "group flex items-center gap-3 rounded-lg border p-2 transition-colors",
                editingId === etiquette.$id && "bg-muted/50",
              )}
            >
              {editingId === etiquette.$id ? (
                // Modo edición inline
                <form action={formAction} className="flex flex-1 items-center gap-2">
                  <input type="hidden" name="calendar" value={calendar.$id} />
                  <input type="hidden" name="calendarSlug" value={calendar.slug} />
                  <input type="hidden" name="isActive" value="true" />
                  <input type="hidden" name="etiquetteId" value={etiquette.$id} />
                  <input type="hidden" name="color" value={newColor} />

                  <Input
                    name="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nombre"
                    className="h-8 flex-1"
                    autoFocus
                    disabled={isPending}
                  />

                  <div className="flex gap-1">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewColor(color)}
                        className={cn(
                          "h-6 w-6 rounded-full transition-transform hover:scale-110",
                          getColorIndicator(color),
                          newColor === color && "ring-ring ring-2 ring-offset-2",
                        )}
                        disabled={isPending}
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    disabled={isPending || !newName.trim() || !newColor}
                  >
                    <Check className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={cancelEdit}
                    className="h-8 w-8"
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                // Modo vista
                <>
                  <div
                    className={cn(
                      "h-3 w-3 shrink-0 rounded-full",
                      getColorIndicator(etiquette.color),
                    )}
                  />
                  <span className="flex-1 text-sm">{etiquette.name}</span>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEdit(etiquette)}
                      className="h-7 w-7"
                      disabled={isPending}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(etiquette)}
                      className="text-destructive hover:text-destructive h-7 w-7"
                      disabled={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Formulario nueva etiqueta */}
          {editingId === "new" ? (
            <form action={formAction} className="flex items-center gap-2 rounded-lg border border-dashed p-2">
              <input type="hidden" name="calendar" value={calendar.$id} />
              <input type="hidden" name="calendarSlug" value={calendar.slug} />
              <input type="hidden" name="isActive" value="true" />
              <input type="hidden" name="color" value={newColor} />

              <Input
                name="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nueva etiqueta..."
                className="h-8 flex-1"
                autoFocus
                disabled={isPending}
              />

              <div className="flex gap-1">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewColor(color)}
                    className={cn(
                      "h-6 w-6 rounded-full transition-transform hover:scale-110",
                      getColorIndicator(color),
                      newColor === color && "ring-ring ring-2 ring-offset-2",
                    )}
                    disabled={isPending}
                  />
                ))}
              </div>

              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                disabled={isPending || !newName.trim() || !newColor}
              >
                <Check className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={cancelEdit}
                className="h-8 w-8"
                disabled={isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                setEditingId("new")
                setNewName("")
                setNewColor("" as Colors)
              }}
              className="w-full border-dashed"
              disabled={isPending || availableColors.length === 0}
            >
              <Plus  />
              Nueva etiqueta
            </Button>
          )}

          {availableColors.length === 0 && editingId !== "new" && (
            <p className="text-muted-foreground text-center text-xs">
              No hay más colores disponibles
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
