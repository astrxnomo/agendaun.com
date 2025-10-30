import { Colors } from "@/lib/data/types"
import { clsx, type ClassValue } from "clsx"
import {
  BookOpen,
  Building2,
  Bus,
  Calendar,
  Clock,
  FlaskConical,
  GraduationCap,
  Landmark,
  MapPin,
  School,
  Stethoscope,
  University,
  Users,
  Utensils,
  Wifi,
  type LucideIcon,
} from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ICON_MAP: Record<string, LucideIcon> = {
  // Calendarios
  Calendar,
  Landmark,
  School,
  University,
  GraduationCap,

  // Horarios/Servicios
  Clock,
  Users,
  Building2,
  FlaskConical,
  BookOpen,
  Bus,
  Utensils,
  Stethoscope,
  Wifi,
  MapPin,
}

export function getIcon(
  iconName: string | null | undefined,
  fallback: LucideIcon = Calendar,
): LucideIcon {
  if (!iconName) return fallback

  const icon = ICON_MAP[iconName]
  return icon || fallback
}

export function hasIcon(iconName: string): boolean {
  return iconName in ICON_MAP
}

export function getAvailableIcons(): string[] {
  return Object.keys(ICON_MAP)
}

export function getColor(color?: Colors): string {
  switch (color) {
    case Colors.BLUE:
      return "bg-blue-200/50 hover:bg-blue-200/40 text-blue-900/90 shadow-blue-700/8 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200"
    case Colors.RED:
      return "bg-red-200/50 hover:bg-red-200/40 text-red-900/90 shadow-red-700/8 dark:bg-red-400/25 dark:hover:bg-red-400/20 dark:text-red-200"
    case Colors.GREEN:
      return "bg-green-200/50 hover:bg-green-200/40 text-green-900/90 shadow-green-700/8 dark:bg-green-400/25 dark:hover:bg-green-400/20 dark:text-green-200"
    case Colors.PURPLE:
      return "bg-purple-200/50 hover:bg-purple-200/40 text-purple-900/90 shadow-purple-700/8 dark:bg-purple-400/25 dark:hover:bg-purple-400/20 dark:text-purple-200"
    case Colors.ORANGE:
      return "bg-orange-200/50 hover:bg-orange-200/40 text-orange-900/90 shadow-orange-700/8 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200"
    case Colors.PINK:
      return "bg-pink-200/50 hover:bg-pink-200/40 text-pink-900/90 shadow-pink-700/8 dark:bg-pink-400/25 dark:hover:bg-pink-400/20 dark:text-pink-200"
    case Colors.TEAL:
      return "bg-teal-200/50 hover:bg-teal-200/40 text-teal-900/90 shadow-teal-700/8 dark:bg-teal-400/25 dark:hover:bg-teal-400/20 dark:text-teal-200"
    case Colors.YELLOW:
      return "bg-yellow-200/50 hover:bg-yellow-200/40 text-yellow-900/90 shadow-yellow-700/8 dark:bg-yellow-400/25 dark:hover:bg-yellow-400/20 dark:text-yellow-200"
    case Colors.LIME:
      return "bg-lime-200/50 hover:bg-lime-200/40 text-lime-900/90 shadow-lime-700/8 dark:bg-lime-400/25 dark:hover:bg-lime-400/20 dark:text-lime-200"
    default:
      return "bg-gray-200/50 hover:bg-gray-200/40 text-gray-900/90 shadow-gray-700/8 dark:bg-gray-400/25 dark:hover:bg-gray-400/20 dark:text-gray-200"
  }
}
export function getColorIndicator(color?: Colors): string {
  switch (color) {
    case Colors.GRAY:
      return "bg-gray-400 dark:bg-gray-500"
    case Colors.BLUE:
      return "bg-blue-500 dark:bg-blue-400"
    case Colors.RED:
      return "bg-red-500 dark:bg-red-400"
    case Colors.GREEN:
      return "bg-green-500 dark:bg-green-400"
    case Colors.PURPLE:
      return "bg-purple-500 dark:bg-purple-400"
    case Colors.ORANGE:
      return "bg-orange-500 dark:bg-orange-400"
    case Colors.PINK:
      return "bg-pink-500 dark:bg-pink-400"
    case Colors.TEAL:
      return "bg-teal-500 dark:bg-teal-400"
    case Colors.YELLOW:
      return "bg-yellow-500 dark:bg-yellow-400"
    case Colors.LIME:
      return "bg-lime-500 dark:bg-lime-400"
    default:
      return "bg-gray-400 dark:bg-gray-500"
  }
}

export function getBorderRadiusClasses(
  isFirstDay: boolean,
  isLastDay: boolean,
): string {
  if (isFirstDay && isLastDay) {
    return "rounded"
  } else if (isFirstDay) {
    return "rounded-l rounded-r-none not-in-data-[slot=popover-content]:w-[calc(100%+5px)]"
  } else if (isLastDay) {
    return "rounded-r rounded-l-none not-in-data-[slot=popover-content]:w-[calc(100%+4px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"
  } else {
    return "rounded-none not-in-data-[slot=popover-content]:w-[calc(100%+9px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"
  }
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export const formatUserName = (name: string | undefined, email: string) => {
  return (name || email)?.replace(/@unal\.edu\.co$/, "")
}
