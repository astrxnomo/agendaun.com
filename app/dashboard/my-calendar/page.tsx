"use client"

import { Edit, Eye, SquarePen } from "lucide-react"
import { useState } from "react"

import PersonalCalendar from "@/components/calendars/personal-calendar"
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
          {isEditable ? <SquarePen /> : <Eye />}
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
              Lectura
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Editar
            </>
          )}
        </Button>
      </div>

      {/* Contenedor con scroll para que funcione el sticky */}
      <div className="flex-1 overflow-auto">
        <PersonalCalendar editable={isEditable} />
      </div>
    </div>
  )
}
