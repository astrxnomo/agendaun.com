"use client"

import { Plus, Settings } from "lucide-react"
import { useState } from "react"

import { type EventColor } from "@/components/calendar/types"
import { useCustomLabels } from "@/components/custom-labels-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const colors: { value: EventColor; label: string; class: string }[] = [
  { value: "blue", label: "Azul", class: "bg-blue-500" },
  { value: "red", label: "Rojo", class: "bg-red-500" },
  { value: "emerald", label: "Verde", class: "bg-emerald-500" },
  { value: "orange", label: "Naranja", class: "bg-orange-500" },
  { value: "purple", label: "Morado", class: "bg-purple-500" },
  { value: "rose", label: "Rosa", class: "bg-rose-500" },
  { value: "yellow", label: "Amarillo", class: "bg-yellow-500" },
  { value: "indigo", label: "Índigo", class: "bg-indigo-500" },
  { value: "pink", label: "Rosa Fuerte", class: "bg-pink-500" },
  { value: "teal", label: "Verde Azulado", class: "bg-teal-500" },
  { value: "cyan", label: "Cian", class: "bg-cyan-500" },
  { value: "lime", label: "Lima", class: "bg-lime-500" },
  { value: "amber", label: "Ámbar", class: "bg-amber-500" },
  { value: "violet", label: "Violeta", class: "bg-violet-500" },
  { value: "green", label: "Verde Claro", class: "bg-green-500" },
]

export function LabelsHeader() {
  const {
    labels,
    addLabel,
    toggleLabelVisibility,
    deleteLabel,
    updateLabel,
    getAvailableColors,
  } = useCustomLabels()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState<EventColor>("blue")
  const [editingLabel, setEditingLabel] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const availableColors = getAvailableColors()
  const canCreateNewLabel = availableColors.length > 0

  const handleCreateLabel = () => {
    if (newLabelName.trim() && canCreateNewLabel) {
      addLabel({
        name: newLabelName.trim(),
        color: newLabelColor,
        isActive: true,
      })
      setNewLabelName("")
      // Establecer el primer color disponible para la próxima etiqueta
      const updatedAvailableColors = getAvailableColors().filter(
        (c) => c !== newLabelColor,
      )
      setNewLabelColor(updatedAvailableColors[0] || "blue")
      setIsCreateOpen(false)
    }
  }

  const handleEditLabel = (labelId: string) => {
    const label = labels.find((l) => l.id === labelId)
    if (label) {
      setEditingLabel(labelId)
      setEditName(label.name)
    }
  }

  const handleSaveEdit = () => {
    if (editingLabel && editName.trim()) {
      updateLabel(editingLabel, { name: editName.trim() })
      setEditingLabel(null)
      setEditName("")
    }
  }

  const handleCancelEdit = () => {
    setEditingLabel(null)
    setEditName("")
  }

  return (
    <div className="bg-background border-b shadow-sm">
      <div className="flex h-12 shrink-0 items-center gap-2 px-4">
        <span className="text-muted-foreground mr-2 text-sm font-medium">
          Etiquetas:
        </span>

        {/* Etiquetas existentes */}
        {labels.map((label) => (
          <div key={label.id} className="flex items-center gap-1">
            {editingLabel === label.id ? (
              <div className="flex items-center gap-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-6 w-24 text-xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit()
                    if (e.key === "Escape") handleCancelEdit()
                  }}
                  onBlur={handleSaveEdit}
                />
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Badge
                    variant={label.isActive ? "default" : "secondary"}
                    className={`cursor-pointer transition-all hover:opacity-80 ${
                      label.isActive
                        ? `bg-${label.color}-500 text-white hover:bg-${label.color}-600`
                        : "opacity-50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      toggleLabelVisibility(label.id)
                    }}
                  >
                    {label.name}
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => toggleLabelVisibility(label.id)}
                  >
                    {label.isActive ? "Ocultar" : "Mostrar"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditLabel(label.id)}>
                    Editar nombre
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => deleteLabel(label.id)}
                    className="text-red-600"
                  >
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}

        {/* Botón para agregar nueva etiqueta */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-6 border-dashed px-2 text-xs"
              disabled={!canCreateNewLabel}
              title={
                canCreateNewLabel
                  ? "Crear nueva etiqueta"
                  : "No hay más colores disponibles para nuevas etiquetas"
              }
              onClick={() => {
                if (canCreateNewLabel) {
                  setNewLabelColor(availableColors[0])
                }
              }}
            >
              <Plus className="mr-1 h-3 w-3" />
              Nueva{" "}
              {!canCreateNewLabel && `(${availableColors.length} disponibles)`}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Etiqueta</DialogTitle>
              <DialogDescription>
                Crea una etiqueta personalizada para organizar tu calendario.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="col-span-3"
                  placeholder="ej. Clases, Reuniones..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateLabel()
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <Select
                  value={newLabelColor}
                  onValueChange={(value: EventColor) => setNewLabelColor(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors
                      .filter((color) => availableColors.includes(color.value))
                      .map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-4 w-4 rounded-full ${color.class}`}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    {availableColors.length === 0 && (
                      <SelectItem value="" disabled>
                        No hay colores disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleCreateLabel}>
                Crear Etiqueta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Botón de configuración adicional */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Settings className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                labels.forEach((label) => {
                  if (!label.isActive) toggleLabelVisibility(label.id)
                })
              }}
            >
              Mostrar todas
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                labels.forEach((label) => {
                  if (label.isActive) toggleLabelVisibility(label.id)
                })
              }}
            >
              Ocultar todas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
