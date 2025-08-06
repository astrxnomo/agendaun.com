"use client"

import { Check, Plus, X } from "lucide-react"
import { useState } from "react"

import { type EventColor } from "@/components/calendar/types"
import { useCustomLabels } from "@/components/custom-labels-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const colorOptions: { value: EventColor; label: string; cssClass: string }[] = [
  { value: "blue", label: "Azul", cssClass: "bg-blue-400" },
  { value: "orange", label: "Naranja", cssClass: "bg-orange-400" },
  { value: "violet", label: "Violeta", cssClass: "bg-violet-400" },
  { value: "rose", label: "Rosa", cssClass: "bg-rose-400" },
  { value: "emerald", label: "Esmeralda", cssClass: "bg-emerald-400" },
  { value: "red", label: "Rojo", cssClass: "bg-red-400" },
  { value: "yellow", label: "Amarillo", cssClass: "bg-yellow-400" },
  { value: "green", label: "Verde", cssClass: "bg-green-400" },
  { value: "cyan", label: "Cian", cssClass: "bg-cyan-400" },
  { value: "purple", label: "Púrpura", cssClass: "bg-purple-400" },
  { value: "pink", label: "Rosa Claro", cssClass: "bg-pink-400" },
  { value: "indigo", label: "Índigo", cssClass: "bg-indigo-400" },
  { value: "teal", label: "Verde Azulado", cssClass: "bg-teal-400" },
  { value: "lime", label: "Lima", cssClass: "bg-lime-400" },
  { value: "amber", label: "Ámbar", cssClass: "bg-amber-400" },
]

export function CustomLabelsSidebar() {
  const {
    labels,
    addLabel,
    deleteLabel,
    toggleLabelVisibility,
    isLabelVisible,
  } = useCustomLabels()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState<EventColor>("blue")

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      addLabel({
        name: newLabelName.trim(),
        color: newLabelColor,
        isActive: true,
      })
      setNewLabelName("")
      setNewLabelColor("blue")
      setIsDialogOpen(false)
    }
  }

  const getColorClass = (color: EventColor) => {
    const colorOption = colorOptions.find((option) => option.value === color)
    return colorOption?.cssClass || "bg-gray-400"
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Mis Etiquetas</span>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
              <span className="sr-only">Agregar etiqueta</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Etiqueta</DialogTitle>
              <DialogDescription>
                Crea una etiqueta personalizada para organizar tus eventos
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="label-name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="ej. Matemáticas, Gimnasio..."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label-color" className="text-right">
                  Color
                </Label>
                <Select
                  value={newLabelColor}
                  onValueChange={(value: EventColor) => setNewLabelColor(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${option.cssClass}`}
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddLabel} disabled={!newLabelName.trim()}>
                Crear Etiqueta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {labels.map((label) => (
            <SidebarMenuItem key={label.id}>
              <SidebarMenuButton
                className="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative justify-between rounded-md has-focus-visible:ring-[3px]"
                asChild
              >
                <div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={label.id}
                      className="peer sr-only"
                      checked={isLabelVisible(label.id)}
                      onCheckedChange={() => toggleLabelVisibility(label.id)}
                    />
                    <Check
                      className="peer-not-data-[state=checked]:invisible"
                      size={16}
                      aria-hidden="true"
                    />
                    <label
                      htmlFor={label.id}
                      className="peer-not-data-[state=checked]:text-muted-foreground/65 cursor-pointer text-sm peer-not-data-[state=checked]:line-through after:absolute after:inset-0"
                    >
                      {label.name}
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-3 w-3 rounded-full ${getColorClass(label.color)}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        deleteLabel(label.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar etiqueta</span>
                    </Button>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
