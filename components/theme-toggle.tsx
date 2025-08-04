"use client"

import { Monitor, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

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

  return (
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
  )
}
