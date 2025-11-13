"use client"

import { Link as LinkIcon, Plus, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EventLinksManagerProps {
  links: string[]
  onChange: (links: string[]) => void
}

export function EventLinksManager({ links, onChange }: EventLinksManagerProps) {
  const [newLink, setNewLink] = useState("")
  const [error, setError] = useState("")

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleAddLink = () => {
    const trimmedLink = newLink.trim()

    if (!trimmedLink) {
      setError("El enlace no puede estar vacío")
      return
    }

    if (!isValidUrl(trimmedLink)) {
      setError("Por favor, ingresa una URL válida (ej: https://ejemplo.com)")
      return
    }

    if (links.includes(trimmedLink)) {
      setError("Este enlace ya fue agregado")
      return
    }

    onChange([...links, trimmedLink])
    setNewLink("")
    setError("")
  }

  const handleRemoveLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddLink()
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Enlaces</Label>

      {/* Input para agregar nuevo link */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
            <LinkIcon size={16} aria-hidden="true" />
          </div>
          <Input
            type="url"
            placeholder="https://ejemplo.com"
            value={newLink}
            onChange={(e) => {
              setNewLink(e.target.value)
              setError("")
            }}
            onKeyPress={handleKeyPress}
            className="ps-9 text-sm"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddLink}
          disabled={!newLink.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}

      {/* Lista de links agregados */}
      {links.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs">
            {links.length} enlace{links.length !== 1 ? "s" : ""} agregado
            {links.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {links.map((link, index) => (
              <div
                key={index}
                className="bg-muted/30 group hover:bg-muted/50 flex items-center gap-2 rounded-md border p-2 transition-colors"
              >
                <LinkIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary min-w-0 flex-1 truncate text-sm hover:underline"
                  title={link}
                >
                  {link}
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveLink(index)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {links.length === 0 && (
        <p className="text-muted-foreground text-center text-xs">
          No hay enlaces agregados
        </p>
      )}
    </div>
  )
}
