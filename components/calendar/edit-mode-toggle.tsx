"use client"

import { Eye, Pencil } from "lucide-react"

import { Switch } from "@/components/ui/switch"

interface EditModeToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function EditModeToggle({
  checked,
  onCheckedChange,
  disabled = false,
}: EditModeToggleProps) {
  return (
    <div className="flex shrink-0 items-center px-4">
      <div className="relative inline-grid h-8 grid-cols-[1fr_1fr] items-center">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="peer absolute inset-0 h-[inherit] w-auto rounded shadow-sm [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded [&_span]:transition-transform [&_span]:duration-200 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        />
        <span className="pointer-events-none relative ms-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
          <Eye className="h-3.5 w-3.5" />
        </span>
        <span className="pointer-events-none relative me-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
          <Pencil className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  )
}
