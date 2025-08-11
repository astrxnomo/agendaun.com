"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const smartToggle = () => {
    const prefersDarkScheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches
    if (theme === "system") {
      setTheme(prefersDarkScheme ? "light" : "dark")
    } else if (
      (theme === "light" && !prefersDarkScheme) ||
      (theme === "dark" && prefersDarkScheme)
    ) {
      setTheme(theme === "light" ? "dark" : "light")
    } else {
      setTheme("system")
    }
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Toggle dark mode"
      onClick={smartToggle}
    >
      <SunIcon className="dark:hidden" size={18} aria-hidden="true" />
      <MoonIcon className="hidden dark:block" size={18} aria-hidden="true" />
      <span className="sr-only">Switch to system/light/dark version</span>
    </Button>
  )
}
