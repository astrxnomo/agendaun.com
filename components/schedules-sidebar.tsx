"use client"

import { ChevronRight, Clock } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { type ScheduleCategories } from "@/lib/appwrite/types"
import { getAllScheduleCategories } from "@/lib/data/schedules/getAllScheduleCategories"
import { getIcon } from "@/lib/utils"

export function SchedulesSidebar() {
  const [categories, setCategories] = useState<ScheduleCategories[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/schedules") {
      return pathname === "/schedules"
    }
    return pathname.startsWith(path)
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllScheduleCategories()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching schedule categories:", error)
      } finally {
        setLoading(false)
      }
    }

    void fetchCategories()
  }, [])

  return (
    <Collapsible asChild defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip="Horarios"
          isActive={isActive("/schedules")}
        >
          <Link href="/schedules">
            <Clock />
            <span>Horarios</span>
          </Link>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction className="data-[state=open]:rotate-90">
            <ChevronRight />
            <span className="sr-only">Expandir Horarios</span>
          </SidebarMenuAction>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <SidebarMenuSubItem key={index}>
                    <div className="flex items-center gap-2 px-2 py-1">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  </SidebarMenuSubItem>
                ))
              : categories.map((category) => {
                  const IconComponent = getIcon(category.icon, Clock)
                  return (
                    <SidebarMenuSubItem key={category.$id}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(`/schedules/${category.slug}`)}
                      >
                        <Link href={`/schedules/${category.slug}`}>
                          <IconComponent className="size-4" />
                          <span>{category.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
