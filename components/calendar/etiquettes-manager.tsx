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
import { getEtiquetteIndicatorColor } from "./utils"

interface EtiquettesManagerProps {
  etiquettes: Etiquettes[]
  calendar: Calendars
  onUpdate: () => void
}

interface EtiquetteForm {
  name: string
  color: Colors
}

const colorOptions = Object.values(Colors).map((color) => ({
  value: color,
  class: getEtiquetteIndicatorColor(color),
}))

export function EtiquettesManager({
  etiquettes,
  calendar,
  onUpdate,
}: EtiquettesManagerProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<EtiquetteForm>({
    name: "",
    color: "" as Colors,
  })

  const resetForm = () => {
    setForm({
      name: "",
      color: "" as Colors,
    })
    setEditingId(null)
  }

  const getAvailableColors = () => {
    const usedColors = etiquettes
      .filter((etiquette) => editingId !== etiquette.$id)
      .map((etiquette) => etiquette.color)

    return colorOptions.filter(
      (option) =>
        !usedColors.includes(option.value) && option.value !== Colors.GRAY,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("El nombre de la etiqueta es requerido")
      return
    }

    setIsLoading(true)
    try {
      const etiquetteData = {
        name: form.name.trim(),
        color: form.color,
        isActive: true,
        calendar_id: calendar.$id,
      }

      let success = false
      if (editingId) {
        const result = await updateEtiquette(editingId, etiquetteData)
        success = !!result
        if (success) {
          toast.success("Etiqueta actualizada")
        }
      } else {
        const result = await createEtiquette(etiquetteData)
        success = !!result
        if (success) {
          toast.success("Etiqueta creada")
        }
      }

      if (success) {
        resetForm()
        onUpdate()
      } else {
        toast.error("Error al guardar la etiqueta")
      }
    } catch (error) {
      console.error("Error saving etiquette:", error)
      toast.error("Error al guardar la etiqueta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (etiquette: Etiquettes) => {
    setForm({
      name: etiquette.name,
      color: etiquette.color,
    })
    setEditingId(etiquette.$id)
  }

  const handleDelete = async (etiquetteId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta etiqueta?")) {
      return
    }

    setIsLoading(true)
    try {
      const success = await deleteEtiquette(etiquetteId)
      if (success) {
        toast.success("Etiqueta eliminada")
        onUpdate()
      } else {
        toast.error("Error al eliminar la etiqueta")
      }
    } catch (error) {
      console.error("Error deleting etiquette:", error)
      toast.error("Error al eliminar la etiqueta")
    } finally {
      setIsLoading(false)
    }
  }

  const getColorClass = (color: Colors) => {
    return getEtiquetteIndicatorColor(color)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2" variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gestionar etiquetas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Label>{editingId ? "Editar etiqueta" : "Crear etiqueta"}</Label>
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
              disabled={isLoading}
              className="bg-muted/30 flex flex-wrap justify-center gap-3 rounded-lg p-3"
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
              <Button type="submit" disabled={isLoading} size="sm">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingId ? (
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                  size="sm"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>

          {etiquettes.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No hay etiquetas
            </p>
          ) : (
            <>
              <Separator className="my-4" />
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium">Etiquetas creadas</h3>
                {etiquettes.map((etiquette) => (
                  <div
                    key={etiquette.$id}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${getColorClass(
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
                        disabled={isLoading}
                        className="h-6 px-2 text-xs"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(etiquette.$id)}
                        disabled={isLoading}
                        className="text-destructive h-6 w-6 p-0"
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
