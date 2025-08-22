"use client"

import { MapPinned } from "lucide-react"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAcademicConfig } from "@/contexts/academic-context"

import { ConfigDialog } from "./dialog"

export function AcademicConfig() {
  const { isComplete, selectedSede, selectedProgram, isLoading } =
    useAcademicConfig()

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-1 h-3 w-32" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={
                !isComplete
                  ? "animate-pulse border border-dashed border-amber-300 dark:border-amber-500"
                  : ""
              }
              tooltip="Mi sede"
            >
              <div
                className={`flex aspect-square size-8 items-center justify-center rounded-lg ${
                  !isComplete ? "bg-amber-500 text-white" : "bg-muted"
                }`}
              >
                <MapPinned className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {isComplete ? selectedSede?.name : "Establecer sede"}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {isComplete
                    ? selectedProgram?.name || "Sin configurar"
                    : "Sede, facultad y programa"}
                </span>
              </div>
            </SidebarMenuButton>
          </DialogTrigger>
          <ConfigDialog />
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
