"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  deleteEtiquette,
  saveEtiquette,
  type EtiquetteActionState,
} from "@/lib/actions/calendar/etiquettes"
import {
  Colors,
  type CalendarEtiquettes,
  type Calendars,
} from "@/lib/data/types"
import { cn, getColorIndicator } from "@/lib/utils"
import { Label } from "../../../ui/label"

interface EtiquettesManagerProps {
  calendar: Calendars
  onUpdate: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

const initialState: EtiquetteActionState = {
  success: false,
  message: "",
}

export function EtiquettesManager({
  calendar,
  onUpdate,
  open,
  onOpenChange,
}: EtiquettesManagerProps) {
  const [editingEtiquette, setEditingEtiquette] =
    useState<CalendarEtiquettes | null>(null)
  const [etiquetteToDelete, setEtiquetteToDelete] =
    useState<CalendarEtiquettes | null>(null)
  const [name, setName] = useState("")
  const [color, setColor] = useState<Colors>("" as Colors)

  const [state, formAction, isPending] = useActionState(
    saveEtiquette,
    initialState,
  )

  useEffect(() => {
    if (state.message) {
      if (state.success && state.data) {
        toast.success(state.message)
        resetForm()
        onUpdate()
      } else if (!state.success && !state.errors) {
        toast.error(state.message)
      }
    }
  }, [state])

  const resetForm = () => {
    setName("")
    setColor("" as Colors)
    setEditingEtiquette(null)
  }

  const getAvailableColors = () => {
    const usedColors = calendar.etiquettes
      .filter((etiquette) => editingEtiquette?.$id !== etiquette.$id)
      .map((etiquette) => etiquette.color)

    return Object.values(Colors)
      .filter((color) => !usedColors.includes(color) && color !== Colors.GRAY)
      .map((color) => ({
        value: color,
        class: getColorIndicator(color),
      }))
  }

  const handleEdit = (etiquette: CalendarEtiquettes) => {
    setName(etiquette.name)
    setColor(etiquette.color)
    setEditingEtiquette(etiquette)
  }

  const handleDeleteClick = (etiquette: CalendarEtiquettes) => {
    setEtiquetteToDelete(etiquette)
  }

  const confirmDelete = async () => {
    if (!etiquetteToDelete) return

    const promise = deleteEtiquette(etiquetteToDelete.$id).then((result) => {
      if (result.success) {
        onUpdate()
        setEtiquetteToDelete(null)
        return result
      } else {
        throw new Error(
          result?.errors?._form?.join(", ") || "Error al eliminar",
        )
      }
    })

    toast.promise(promise, {
      loading: "Eliminando...",
      success: (result) => result.message,
      error: (error) =>
        error instanceof Error ? error.message : "Error al eliminar",
    })
  }

  const cancelDelete = () => {
    setEtiquetteToDelete(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {!etiquetteToDelete ? (
          <>
            <DialogHeader>
              <DialogTitle>Etiquetas</DialogTitle>
            </DialogHeader>

            <form action={formAction} className="space-y-3">
              <input type="hidden" name="calendar" value={calendar.$id} />
              {editingEtiquette && (
                <input
                  type="hidden"
                  name="etiquetteId"
                  value={editingEtiquette.$id}
                />
              )}

              {state.errors?._form && (
                <div className="bg-destructive/10 text-destructive rounded-md p-2 text-xs">
                  {state.errors._form.join(", ")}
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nombre
                  </Label>
                  <span className="text-muted-foreground text-xs">
                    {name.length}/50
                  </span>
                </div>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 50))}
                  placeholder="Nombre de la etiqueta"
                  maxLength={50}
                  disabled={isPending}
                  aria-invalid={state.errors?.name ? "true" : "false"}
                />
                {state.errors?.name && (
                  <p className="text-destructive text-xs">
                    {state.errors.name.join(", ")}
                  </p>
                )}
              </div>

              <RadioGroup
                name="color"
                value={color}
                onValueChange={(value) => setColor(value as Colors)}
                className="bg-muted/30 flex flex-wrap justify-center gap-3 rounded-lg p-3"
                disabled={isPending}
              >
                {getAvailableColors().map((option) => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="sr-only"
                    />
                    <label
                      htmlFor={option.value}
                      className={cn(
                        "block size-5 cursor-pointer rounded-full transition-all duration-200",
                        option.class,
                        color === option.value
                          ? "ring-foreground/20 ring-offset-background scale-125 shadow-lg ring-2 ring-offset-2"
                          : "hover:scale-110 hover:shadow-md",
                      )}
                    />
                  </div>
                ))}
              </RadioGroup>
              {state.errors?.color && (
                <p className="text-destructive text-xs">
                  {state.errors.color.join(", ")}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1"
                  disabled={isPending || !name.trim() || !color}
                >
                  {editingEtiquette ? "Actualizar" : "Crear"}
                </Button>
                {editingEtiquette && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>

            {calendar.etiquettes.length > 0 && (
              <div className="space-y-2 border-t pt-3">
                {calendar.etiquettes.map((etiquette) => (
                  <Item
                    key={etiquette.$id}
                    className={cn(
                      "bg-muted/30 p-3",
                      editingEtiquette?.$id === etiquette.$id &&
                        "border-primary/50 bg-primary/5",
                    )}
                  >
                    <ItemMedia>
                      <div
                        className={cn(
                          "size-4 rounded-full",
                          getColorIndicator(etiquette.color),
                        )}
                      />
                    </ItemMedia>

                    <ItemContent>
                      <ItemTitle className="text-sm font-medium">
                        {etiquette.name}
                      </ItemTitle>
                    </ItemContent>

                    <ItemActions className="gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(etiquette)}
                        className="h-7 w-7"
                        disabled={isPending}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(etiquette)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                        disabled={isPending}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>¿Eliminar etiqueta?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Al eliminar la etiqueta{" "}
                <span className="font-semibold">{etiquetteToDelete.name}</span>,
                los eventos asociados quedarán sin etiqueta. Esta acción no se
                puede deshacer.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={cancelDelete}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={confirmDelete}
                  disabled={isPending}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
