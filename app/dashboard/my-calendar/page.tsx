"use client"

import { Edit, Eye } from "lucide-react"
import { useState } from "react"

import { LabelsHeader } from "@/components/calendar/labels-header"
import PersonalCalendar from "@/components/calendars/personal-calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [isEditable, setIsEditable] = useState(true)

  const toggleEditMode = () => {
    setIsEditable(!isEditable)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background flex h-16 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Mi Calendario Personal</h1>
          <Badge
            variant={isEditable ? "default" : "secondary"}
            className={`text-xs ${
              isEditable
                ? "border-green-200 bg-green-100 text-green-800"
                : "border-gray-200 bg-gray-100 text-gray-600"
            }`}
          >
            {isEditable ? "Modo Edición" : "Solo Lectura"}
          </Badge>
        </div>
        <Button
          variant={isEditable ? "outline" : "default"}
          size="sm"
          onClick={toggleEditMode}
          className="flex items-center gap-2"
          title={
            isEditable
              ? "Cambiar a modo solo lectura - No podrás editar eventos"
              : "Habilitar edición - Podrás crear, editar y eliminar eventos"
          }
        >
          {isEditable ? (
            <>
              <Eye className="h-4 w-4" />
              Solo Lectura
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Habilitar Edición
            </>
          )}
        </Button>
      </div>

      {/* Contenedor con scroll para que funcione el sticky */}
      <div className="flex-1 overflow-auto">
        <LabelsHeader />
        <PersonalCalendar editable={isEditable} />
      </div>
    </div>
  )
}
