"use client"

import { Edit, Eye } from "lucide-react"
import { useState } from "react"

import PersonalCalendar from "@/components/calendars/personal-calendar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [isEditable, setIsEditable] = useState(false)

  const toggleEditMode = () => {
    setIsEditable(!isEditable)
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Mi Calendario", isCurrentPage: true },
        ]}
        action={
          <Button
            variant={isEditable ? "outline" : "default"}
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
                <Eye />
                Lectura
              </>
            ) : (
              <>
                <Edit />
                Editar
              </>
            )}
          </Button>
        }
      />
      <PersonalCalendar editable={isEditable} />
    </>
  )
}
