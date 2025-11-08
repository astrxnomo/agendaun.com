"use client"

import { Calendar, CalendarDays, Clock, Home, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export default function Search() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleNavigation = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  return (
    <>
      <button
        className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-9 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="text-muted-foreground/80 -ms-1 me-3"
            size={16}
            aria-hidden="true"
          />
          <span className="text-muted-foreground/70 font-normal">Buscar</span>
        </span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar páginas, calendarios, horarios..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>

          <CommandGroup>
            <CommandItem onSelect={() => handleNavigation("/")}>
              <Home size={16} className="opacity-60" aria-hidden="true" />
              <span>Inicio</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Yo">
            <CommandItem
              onSelect={() => handleNavigation("/calendars/personal")}
            >
              <Calendar size={16} className="opacity-60" aria-hidden="true" />
              <span>Mi calendario</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Universidad">
            <CommandItem onSelect={() => handleNavigation("/calendars/unal")}>
              <CalendarDays
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Calendario</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigation("/schedules")}>
              <Clock size={16} className="opacity-60" aria-hidden="true" />
              <span>Horarios</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
