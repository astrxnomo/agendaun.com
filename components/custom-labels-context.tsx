"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import { type EventColor } from "@/components/calendar/types"

export interface CustomLabel {
  id: string
  name: string
  color: EventColor
  isActive: boolean
  createdAt: Date
}

interface CustomLabelsContextType {
  labels: CustomLabel[]
  addLabel: (label: Omit<CustomLabel, "id" | "createdAt">) => void
  updateLabel: (id: string, updates: Partial<CustomLabel>) => void
  deleteLabel: (id: string) => void
  toggleLabelVisibility: (id: string) => void
  isLabelVisible: (labelId: string | undefined) => boolean
  getLabelByColor: (color: EventColor | undefined) => CustomLabel | undefined
  getLabelByName: (name: string | undefined) => CustomLabel | undefined
  isEventVisible: (event: { color?: EventColor; label?: string }) => boolean
  getAvailableColors: () => EventColor[]
}

const CustomLabelsContext = createContext<CustomLabelsContextType | undefined>(
  undefined,
)

// Etiquetas predeterminadas para Mi Calendario
const defaultLabels: CustomLabel[] = [
  {
    id: "materias",
    name: "Materias",
    color: "blue",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "reuniones",
    name: "Reuniones",
    color: "orange",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "semilleros",
    name: "Semilleros",
    color: "emerald",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "examenes",
    name: "Exámenes",
    color: "red",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "proyectos",
    name: "Proyectos",
    color: "purple",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "personal",
    name: "Personal",
    color: "rose",
    isActive: true,
    createdAt: new Date(),
  },
]

export function CustomLabelsProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<CustomLabel[]>(defaultLabels)

  const addLabel = (newLabel: Omit<CustomLabel, "id" | "createdAt">) => {
    const label: CustomLabel = {
      ...newLabel,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setLabels((prev) => [...prev, label])
  }

  const updateLabel = (id: string, updates: Partial<CustomLabel>) => {
    setLabels((prev) =>
      prev.map((label) => (label.id === id ? { ...label, ...updates } : label)),
    )
  }

  const deleteLabel = (id: string) => {
    setLabels((prev) => prev.filter((label) => label.id !== id))
  }

  const toggleLabelVisibility = (id: string) => {
    setLabels((prev) =>
      prev.map((label) =>
        label.id === id ? { ...label, isActive: !label.isActive } : label,
      ),
    )
  }

  const isLabelVisible = (labelId: string | undefined) => {
    if (!labelId) return true
    const label = labels.find((l) => l.id === labelId)
    return label?.isActive ?? true
  }

  const getLabelByColor = (color: EventColor | undefined) => {
    if (!color) return undefined
    return labels.find((label) => label.color === color && label.isActive)
  }

  const getLabelByName = (name: string | undefined) => {
    if (!name) return undefined
    return labels.find((label) => label.name === name)
  }

  const isEventVisible = (event: { color?: EventColor; label?: string }) => {
    // Si el evento tiene una etiqueta definida como string, buscar por nombre o ID
    if (event.label) {
      const labelByName = getLabelByName(event.label)
      const labelById = labels.find((label) => label.id === event.label)
      const label = labelByName || labelById
      return label ? label.isActive : true // Si no encuentra la etiqueta, mostrar el evento
    }

    // Si no tiene etiqueta pero tiene color, buscar por color
    if (event.color) {
      const label = getLabelByColor(event.color)
      return label ? label.isActive : true // Si no encuentra etiqueta para ese color, mostrar el evento
    }

    // Eventos sin etiqueta ni color específico se muestran siempre
    return true
  }

  const getAvailableColors = (): EventColor[] => {
    const allColors: EventColor[] = [
      "blue",
      "red",
      "emerald",
      "orange",
      "purple",
      "rose",
      "yellow",
      "indigo",
      "pink",
      "teal",
      "cyan",
      "lime",
      "amber",
      "violet",
      "green",
    ]
    const usedColors = labels.map((label) => label.color)
    return allColors.filter((color) => !usedColors.includes(color))
  }

  return (
    <CustomLabelsContext.Provider
      value={{
        labels,
        addLabel,
        updateLabel,
        deleteLabel,
        toggleLabelVisibility,
        isLabelVisible,
        getLabelByColor,
        getLabelByName,
        isEventVisible,
        getAvailableColors,
      }}
    >
      {children}
    </CustomLabelsContext.Provider>
  )
}

export function useCustomLabels() {
  const context = useContext(CustomLabelsContext)
  if (context === undefined) {
    throw new Error(
      "useCustomLabels must be used within a CustomLabelsProvider",
    )
  }
  return context
}
