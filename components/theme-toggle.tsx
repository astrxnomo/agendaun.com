"use client"

import { Monitor, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { state } = useSidebar()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const themes = [
    { name: "light", icon: SunIcon, label: "Claro" },
    { name: "dark", icon: MoonIcon, label: "Oscuro" },
    { name: "system", icon: Monitor, label: "Sistema" },
  ] as const

  // En sidebar colapsado, solo mostrar el tema actual
  if (state === "collapsed") {
    const currentTheme = themes.find((t) => t.name === theme) || themes[0]
    const CurrentIcon = currentTheme.icon

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <button
            onClick={() => {
              const currentIndex = themes.findIndex((t) => t.name === theme)
              const nextIndex = (currentIndex + 1) % themes.length
              setTheme(themes[nextIndex].name)
            }}
            className="text-primary-foreground hover:bg-muted/90 flex size-8 items-center justify-center rounded-lg transition-colors"
            aria-label={`Tema actual: ${currentTheme.label}. Clic para cambiar`}
          >
            <CurrentIcon className="size-4" />
          </button>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Sidebar expandido, mostrar diseño horizontal original
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center space-x-1 rounded p-0.5">
          {themes.map(({ name, icon: Icon, label }) => (
            <button
              key={name}
              onClick={() => setTheme(name)}
              className={`flex items-center justify-center rounded-md p-1 text-sm font-medium transition-all ${
                theme === name
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              aria-label={`Cambiar a tema ${label.toLowerCase()}`}
            >
              <Icon className="h-3 w-3" />
            </button>
          ))}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
