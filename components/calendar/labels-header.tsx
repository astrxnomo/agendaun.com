"use client"

import { Plus, Settings } from "lucide-react"
import { useState } from "react"

import { useCalendarContext } from "@/components/calendar/calendar-context"
import {
  calendarColors,
  getCircleColorClass,
  getEventColorClasses,
} from "@/components/calendar/colors"
import { type CustomLabel, type EventColor } from "@/components/calendar/types"
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

interface LabelsHeaderProps {
  editable?: boolean
  labels?: CustomLabel[]
  onLabelAdd?: (label: Omit<CustomLabel, "id">) => void
  onLabelUpdate?: (id: string, updates: Partial<CustomLabel>) => void
  onLabelDelete?: (labelId: string) => void
  onLabelToggle?: (labelId: string) => void
}

export function LabelsHeader({
  editable = true,
  labels = [],
  onLabelAdd,
  onLabelUpdate,
  onLabelDelete,
  onLabelToggle,
}: LabelsHeaderProps) {
  const { toggleLabelVisibility, isLabelVisible } = useCalendarContext()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState<EventColor>("blue")
  const [editingLabel, setEditingLabel] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  // Calcular colores disponibles basado en las etiquetas pasadas como props
  const getAvailableColors = (): EventColor[] => {
    const allColors: EventColor[] = [
      "gray",
      "blue",
      "red",
      "green",
      "purple",
      "orange",
      "pink",
      "teal",
      "yellow",
      "indigo",
    ]
    const usedColors = labels.map((label) => label.color)
    return allColors.filter((color) => !usedColors.includes(color))
  }

  const availableColors = getAvailableColors()
  const canCreateNewLabel = availableColors.length > 0

  const handleCreateLabel = () => {
    if (newLabelName.trim() && canCreateNewLabel && onLabelAdd) {
      onLabelAdd({
        name: newLabelName.trim(),
        color: newLabelColor,
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
    if (editingLabel && editName.trim() && onLabelUpdate) {
      onLabelUpdate(editingLabel, { name: editName.trim() })
      setEditingLabel(null)
      setEditName("")
    }
  }

  const handleCancelEdit = () => {
    setEditingLabel(null)
    setEditName("")
  }

  return (
    <div className="bg-background sticky top-0 z-10 border-b shadow-sm">
      <div className="scrollbar-none flex h-12 shrink-0 items-center gap-2 overflow-x-auto px-4">
        <span className="text-muted-foreground mr-2 shrink-0 text-sm font-medium">
          Etiquetas:
        </span>

        {/* Etiquetas existentes */}
        <div className="flex shrink-0 items-center gap-1">
          {labels.map((label) => (
            <div key={label.id} className="flex items-center gap-1">
              {editingLabel === label.id ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-6 w-24 text-xs"
                    autoFocus
                    disabled={!editable}
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
                      variant={
                        isLabelVisible(label.id) ? "default" : "secondary"
                      }
                      className={`cursor-pointer transition-all hover:opacity-80 ${
                        isLabelVisible(label.id)
                          ? getEventColorClasses(label.color)
                          : "opacity-50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        // En modo solo lectura, alternar directamente con un click
                        if (!editable) {
                          toggleLabelVisibility(label.id)
                          onLabelToggle?.(label.id)
                          return
                        }
                        // En modo edición, también permite alternar con click directo
                        toggleLabelVisibility(label.id)
                        onLabelToggle?.(label.id)
                      }}
                    >
                      {label.name}
                    </Badge>
                  </DropdownMenuTrigger>
                  {editable && (
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          toggleLabelVisibility(label.id)
                          onLabelToggle?.(label.id)
                        }}
                      >
                        {isLabelVisible(label.id) ? "Ocultar" : "Mostrar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditLabel(label.id)}
                      >
                        Editar nombre
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onLabelDelete?.(label.id)}
                        className="text-red-600"
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>

        {/* Botón para agregar nueva etiqueta - solo si está en modo edición */}
        {editable && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 shrink-0 border-dashed px-2 text-xs"
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
                <span className="hidden sm:inline">Nueva</span>
                <span className="sm:hidden">+</span>
                {!canCreateNewLabel && (
                  <span className="hidden lg:inline">
                    {" "}
                    ({availableColors.length} disponibles)
                  </span>
                )}
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
                    onValueChange={(value: EventColor) =>
                      setNewLabelColor(value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona un color" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendarColors
                        .filter((color) =>
                          availableColors.includes(color.value),
                        )
                        .map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`h-4 w-4 rounded-full ${getCircleColorClass(color.value)}`}
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
        )}

        {/* Botón de configuración adicional */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 shrink-0 p-0">
              <Settings className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                labels.forEach((label) => {
                  if (!isLabelVisible(label.id)) {
                    toggleLabelVisibility(label.id)
                    onLabelToggle?.(label.id)
                  }
                })
              }}
            >
              Mostrar todas
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                labels.forEach((label) => {
                  if (isLabelVisible(label.id)) {
                    toggleLabelVisibility(label.id)
                    onLabelToggle?.(label.id)
                  }
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
