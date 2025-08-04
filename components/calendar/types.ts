export type CalendarView = "month" | "week" | "day" | "agenda"

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly"

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday, 1 = Monday, etc.

export interface RecurrenceRule {
  type: RecurrenceType
  interval: number // Every X days/weeks/months
  endDate?: Date
  count?: number // Alternative to endDate - repeat X times
  daysOfWeek?: DayOfWeek[] // For weekly recurrence, which days
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: EventColor
  label?: string
  location?: string
  recurrence?: RecurrenceRule
  seriesId?: string // ID for recurring event series
}

export type EventColor =
  | "sky"
  | "blue"
  | "orange"
  | "violet"
  | "rose"
  | "emerald"
