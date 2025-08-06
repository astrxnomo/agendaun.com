"use client"
import { MapPinHouse } from "lucide-react"
import { useId } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

import { useFilters } from "./filters-context"

interface ConfigFilterButtonProps {
  variant?: "nav" | "sidebar"
}

export default function ConfigFilterButton({
  variant = "nav",
}: ConfigFilterButtonProps) {
  const id = useId()
  const isMobile = useIsMobile()
  const { filters, handleFilterChange, activeFiltersCount, formatLabel } =
    useFilters()

  // Determinar si mostrar badges (solo en nav y no mobile)
  const showBadges = variant === "nav" && !isMobile

  // Determinar el tamaño y variante del botón
  const buttonSize = variant === "sidebar" ? "sm" : "sm"
  const showText = variant === "nav" && !isMobile

  // Contenido común del popover
  const renderPopoverContent = () => (
    <PopoverContent className="w-72 p-4">
      <div className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
          Establecer mi sede
          {activeFiltersCount < 3 && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-[10px] text-orange-700"
            >
              Requerido
            </Badge>
          )}
        </div>

        <form>
          <div className="space-y-4">
            {/* Sede */}
            <div className="space-y-2">
              <Label htmlFor={`${id}-sede`} className="text-sm font-medium">
                Sede
              </Label>
              <Select
                value={filters.sede}
                onValueChange={(value) => handleFilterChange("sede", value)}
              >
                <SelectTrigger id={`${id}-sede`}>
                  <SelectValue placeholder="Seleccionar sede" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sede-central">Sede Central</SelectItem>
                  <SelectItem value="sede-norte">Sede Norte</SelectItem>
                  <SelectItem value="sede-sur">Sede Sur</SelectItem>
                  <SelectItem value="sede-este">Sede Este</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Facultad */}
            <div className="space-y-2">
              <Label htmlFor={`${id}-facultad`} className="text-sm font-medium">
                Facultad
              </Label>
              <Select
                value={filters.facultad}
                onValueChange={(value) => handleFilterChange("facultad", value)}
              >
                <SelectTrigger id={`${id}-facultad`}>
                  <SelectValue placeholder="Seleccionar facultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingenieria">
                    Facultad de Ingeniería
                  </SelectItem>
                  <SelectItem value="ciencias">Facultad de Ciencias</SelectItem>
                  <SelectItem value="administracion">
                    Facultad de Administración
                  </SelectItem>
                  <SelectItem value="ciencias-humanas">
                    Facultad de Ciencias Humanas
                  </SelectItem>
                  <SelectItem value="derecho">Facultad de Derecho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Programa */}
            <div className="space-y-2">
              <Label htmlFor={`${id}-programa`} className="text-sm font-medium">
                Programa
              </Label>
              <Select
                value={filters.programa}
                onValueChange={(value) => handleFilterChange("programa", value)}
              >
                <SelectTrigger id={`${id}-programa`}>
                  <SelectValue placeholder="Seleccionar programa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingenieria-sistemas">
                    Ingeniería de Sistemas
                  </SelectItem>
                  <SelectItem value="ingenieria-industrial">
                    Ingeniería Industrial
                  </SelectItem>
                  <SelectItem value="administracion-empresas">
                    Administración de Empresas
                  </SelectItem>
                  <SelectItem value="psicologia">Psicología</SelectItem>
                  <SelectItem value="derecho">Derecho</SelectItem>
                  <SelectItem value="medicina">Medicina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </div>
    </PopoverContent>
  )

  // Si es variant sidebar, usar el estilo de SidebarMenuButton
  if (variant === "sidebar") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Popover>
            <PopoverTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                  activeFiltersCount < 3
                    ? "animate-pulse border-2 border-orange-300"
                    : ""
                }`}
                tooltip={
                  activeFiltersCount < 3
                    ? "<Configura tu ubicación académica para personalizar tu vista"
                    : "Configuración de ubicación académica"
                }
              >
                <div
                  className={`relative flex aspect-square size-8 items-center justify-center rounded-lg ${
                    activeFiltersCount < 3
                      ? "bg-orange-500 text-white"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <MapPinHouse className="size-4" />
                  {activeFiltersCount < 3 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 min-w-4 bg-orange-200 px-1 text-[8px] text-orange-800"
                    >
                      !
                    </Badge>
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeFiltersCount < 3 ? "Establecer sede" : "Mi sede"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    Sede, facultad y programa
                  </span>
                </div>
              </SidebarMenuButton>
            </PopoverTrigger>
            {renderPopoverContent()}
          </Popover>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size={buttonSize}
            className={`relative ${
              activeFiltersCount < 3
                ? "animate-pulse border-2 border-orange-300 bg-orange-400 hover:bg-orange-400/90"
                : ""
            }`}
            aria-label={
              activeFiltersCount < 3
                ? "<Configura tu ubicación académica"
                : "Configuración de ubicación académica"
            }
          >
            <MapPinHouse size={16} aria-hidden="true" />
            {activeFiltersCount < 3 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 min-w-4 bg-orange-200 px-1 text-[8px] text-orange-800"
              >
                !
              </Badge>
            )}
            {showText && "Mi sede"}
          </Button>
        </PopoverTrigger>
        {renderPopoverContent()}
      </Popover>
      {/* Active filters badges - solo en nav y no mobile */}
      {showBadges && filters.sede && (
        <Badge variant="secondary" className="text-xs">
          {formatLabel(filters.sede)}
        </Badge>
      )}
      {showBadges && filters.facultad && (
        <Badge variant="secondary" className="text-xs">
          {formatLabel(filters.facultad)}
        </Badge>
      )}
      {showBadges && filters.programa && (
        <Badge variant="secondary" className="text-xs">
          {formatLabel(filters.programa)}
        </Badge>
      )}
    </div>
  )
}
