/**
 * @fileoverview Schedule Constants
 * @description Constants shared across schedule components
 * @category Constants
 */

// Re-export calendar constants that schedule uses
export {
  EndHour,
  StartHour,
  WeekCellsHeight,
} from "@/components/calendar/constants"

// Schedule-specific constants
export const DefaultEventDuration = 60 // Duration in minutes for new events
export const QuarterHourIntervals = [0, 1, 2, 3] // Quarter hour divisions for click areas
export const MinEventHeight = 40 // Minimum height in pixels to show event time

// Days of the week for schedule (Monday-first)
export const DaysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const

export const DaysOfWeekShort = ["L", "M", "M", "J", "V", "S", "D"] as const
