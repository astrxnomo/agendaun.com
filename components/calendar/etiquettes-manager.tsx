"use client"

import { Loader2, Settings, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  createEtiquette,
  deleteEtiquette,
  updateEtiquette,
} from "@/lib/actions/etiquettes.actions"
import { type Calendars, Colors, type Etiquettes } from "@/types"

import { Separator } from "../ui/separator"
import { getColorIndicator } from "./utils"

interface EtiquettesManagerProps {
  calendar: Calendars
  onUpdate: () => void
}

interface EtiquetteForm {
  name: string
  color: Colors
}

export function EtiquettesManager({
  calendar,
  onUpdate,
}: EtiquettesManagerProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingEtiquette, setEditingEtiquette] = useState<Etiquettes | null>(
    null,
  )
  const [form, setForm] = useState<EtiquetteForm>({
    name: "",
    color: "" as Colors,
  })

  const resetForm = () => {
    setForm({
      name: "",
      color: "" as Colors,
    })
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

  const handleEdit = (etiquette: Etiquettes) => {
    setForm({
      name: etiquette.name,
      color: etiquette.color,
    })
    setEditingEtiquette(etiquette)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("El nombre de la etiqueta es requerido")
      return
    }

    const isEditing = !!editingEtiquette

    setIsLoading(true)
    const promise = isEditing
      ? updateEtiquette({
          ...editingEtiquette,
          name: form.name.trim(),
          color: form.color,
        })
      : createEtiquette({
          name: form.name.trim(),
          color: form.color,
          calendar: calendar,
        } as Etiquettes)

    toast.promise(promise, {
      loading: isEditing ? "Actualizando etiqueta..." : "Creando etiqueta...",
      success: (result) => {
        resetForm()
        onUpdate()
        setIsLoading(false)
        return `Etiqueta "${result.name}" ${isEditing ? "actualizada" : "creada"}`
      },
      error: (err: Error) => {
        setIsLoading(false)
        return err.message || "Error inesperado"
      },
    })
  }

  const handleDelete = (etiquette: Etiquettes) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta etiqueta?")) {
      return
    }

    setIsLoading(true)
    const promise = deleteEtiquette(etiquette.$id).then(() => {
      onUpdate()
      return true
    })

    toast.promise(promise, {
      loading: "Eliminando etiqueta...",
      success: () => `Etiqueta "${etiquette.name}" eliminada`,
      error: (err: Error) => err.message || "Error al eliminar la etiqueta",
    })
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2" variant="ghost" size="sm" disabled={isLoading}>
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gestionar etiquetas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <Label>
              {editingEtiquette ? "Editar etiqueta" : "Crear etiqueta"}
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nombre de la etiqueta"
              disabled={isLoading}
            />
            <RadioGroup
              value={form.color}
              onValueChange={(value) =>
                setForm({ ...form, color: value as Colors })
              }
              className="bg-muted/30 flex flex-wrap justify-center gap-3 rounded-lg p-3"
              disabled={isLoading}
            >
              {getAvailableColors().map((option) => (
                <div key={option.value} className="relative">
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={option.value}
                    className={`block h-5 w-5 cursor-pointer rounded-full transition-all duration-200 ${option.class} ${
                      form.color === option.value
                        ? "ring-foreground/20 ring-offset-background scale-125 shadow-lg ring-2 ring-offset-2"
                        : "hover:scale-110 hover:shadow-md"
                    }`}
                  />
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : editingEtiquette ? (
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </Button>
              {editingEtiquette && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  size="sm"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>

          {calendar.etiquettes.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No hay etiquetas
            </p>
          ) : (
            <>
              <Separator className="my-4" />
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium">Etiquetas creadas</h3>
                {calendar.etiquettes.map((etiquette) => (
                  <div
                    key={etiquette.$id}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${getColorIndicator(
                          etiquette.color,
                        )}`}
                      />
                      <span className="text-sm">{etiquette.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(etiquette)}
                        className="h-6 px-2 text-xs"
                        disabled={isLoading}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(etiquette)}
                        className="text-destructive h-6 w-6 p-0"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
