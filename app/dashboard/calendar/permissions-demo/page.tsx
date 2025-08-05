"use client"

import { useState } from "react"

import { CalendarProvider } from "@/components/calendar/calendar-context"
import { useCalendarPermissions } from "@/components/calendar/permissions"
import DepartmentCalendar from "@/components/calendars/department-calendar"
import NationalCalendar from "@/components/calendars/national-calendar"
import PublicCalendar from "@/components/calendars/public-calendar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type UserRole = "admin" | "editor" | "moderator" | "user"
type CalendarType = "personal" | "national" | "department" | "public"

const roleDescriptions = {
  admin: "Acceso completo a todos los calendarios",
  editor: "Puede editar calendarios departamentales y públicos",
  moderator: "Puede editar solo calendarios públicos",
  user: "Solo lectura en calendarios nacionales, departamentales y públicos",
}

const calendarDescriptions = {
  personal: "Tu calendario personal - siempre editable",
  national: "Festividades nacionales de Colombia",
  department: "Eventos académicos del departamento",
  public: "Eventos públicos universitarios",
}

export default function PermissionsDemoPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("user")
  const [selectedCalendar, setSelectedCalendar] =
    useState<CalendarType>("national")

  const permissions = useCalendarPermissions(selectedCalendar, selectedRole)

  const renderCalendar = () => {
    // Cada calendario en la demo necesita su propio CalendarProvider
    // para mantener estado independiente
    switch (selectedCalendar) {
      case "national":
        return (
          <CalendarProvider>
            <NationalCalendar userRole={selectedRole} />
          </CalendarProvider>
        )
      case "department":
        return (
          <CalendarProvider>
            <DepartmentCalendar userRole={selectedRole} />
          </CalendarProvider>
        )
      case "public":
        return (
          <CalendarProvider>
            <PublicCalendar userRole={selectedRole} />
          </CalendarProvider>
        )
      default:
        return (
          <div className="py-8 text-center text-gray-500">
            Selecciona un tipo de calendario para ver la demo
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Demo de Sistema de Permisos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Prueba diferentes combinaciones de roles y tipos de calendario para
          ver cómo funciona el sistema de permisos
        </p>
      </div>

      {/* Controles de demostración */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Rol de Usuario</CardTitle>
            <CardDescription>
              Cambia el rol para ver diferentes niveles de acceso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedRole}
              onValueChange={(value: UserRole) => setSelectedRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">👑 Administrador</SelectItem>
                <SelectItem value="editor">✏️ Editor</SelectItem>
                <SelectItem value="moderator">🛡️ Moderador</SelectItem>
                <SelectItem value="user">👤 Usuario</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {roleDescriptions[selectedRole]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Tipo de Calendario</CardTitle>
            <CardDescription>
              Prueba diferentes tipos de calendario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedCalendar}
              onValueChange={(value: CalendarType) =>
                setSelectedCalendar(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un calendario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">📅 Personal</SelectItem>
                <SelectItem value="national">🇨🇴 Nacional</SelectItem>
                <SelectItem value="department">🏫 Departamental</SelectItem>
                <SelectItem value="public">🌍 Público</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {calendarDescriptions[selectedCalendar]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información de permisos actuales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Permisos Actuales
            <Badge variant={permissions.canEdit ? "default" : "secondary"}>
              {permissions.canEdit ? "Editable" : "Solo lectura"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Permisos para {selectedRole} en calendario {selectedCalendar}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${permissions.canView ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm">Ver eventos</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${permissions.canCreate ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm">Crear eventos</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${permissions.canEdit ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm">Editar eventos</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${permissions.canDelete ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm">Eliminar eventos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendario de demostración */}

      {renderCalendar()}

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Instrucciones de Uso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            • <strong>Rol Usuario:</strong> Solo puede ver eventos, no puede
            crear ni editar
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            • <strong>Rol Moderador:</strong> Puede editar eventos en
            calendarios públicos únicamente
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            • <strong>Rol Editor:</strong> Puede editar eventos en calendarios
            departamentales y públicos
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            • <strong>Rol Administrador:</strong> Acceso completo a todos los
            calendarios
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            • <strong>Calendario Personal:</strong> Siempre editable
            independientemente del rol
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
