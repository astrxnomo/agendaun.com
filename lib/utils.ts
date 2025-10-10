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
