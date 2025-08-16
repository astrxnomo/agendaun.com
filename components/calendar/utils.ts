import { isSameDay } from "date-fns"

import { EtiquetteColor, type Events } from "@/types/db"

export function getColor(color?: EtiquetteColor): string {
  switch (color) {
    case EtiquetteColor.GRAY:
      return "bg-gray-200/50 hover:bg-gray-200/40 text-gray-900/90 shadow-gray-700/8 dark:bg-gray-400/25 dark:hover:bg-gray-400/20 dark:text-gray-200"
    case EtiquetteColor.BLUE:
      return "bg-blue-200/50 hover:bg-blue-200/40 text-blue-900/90 shadow-blue-700/8 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200"
    case EtiquetteColor.RED:
      return "bg-red-200/50 hover:bg-red-200/40 text-red-900/90 shadow-red-700/8 dark:bg-red-400/25 dark:hover:bg-red-400/20 dark:text-red-200"
    case EtiquetteColor.GREEN:
      return "bg-green-200/50 hover:bg-green-200/40 text-green-900/90 shadow-green-700/8 dark:bg-green-400/25 dark:hover:bg-green-400/20 dark:text-green-200"
    case EtiquetteColor.PURPLE:
      return "bg-purple-200/50 hover:bg-purple-200/40 text-purple-900/90 shadow-purple-700/8 dark:bg-purple-400/25 dark:hover:bg-purple-400/20 dark:text-purple-200"
    case EtiquetteColor.ORANGE:
      return "bg-orange-200/50 hover:bg-orange-200/40 text-orange-900/90 shadow-orange-700/8 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200"
    case EtiquetteColor.PINK:
      return "bg-pink-200/50 hover:bg-pink-200/40 text-pink-900/90 shadow-pink-700/8 dark:bg-pink-400/25 dark:hover:bg-pink-400/20 dark:text-pink-200"
    case EtiquetteColor.TEAL:
      return "bg-teal-200/50 hover:bg-teal-200/40 text-teal-900/90 shadow-teal-700/8 dark:bg-teal-400/25 dark:hover:bg-teal-400/20 dark:text-teal-200"
    case EtiquetteColor.YELLOW:
      return "bg-yellow-200/50 hover:bg-yellow-200/40 text-yellow-900/90 shadow-yellow-700/8 dark:bg-yellow-400/25 dark:hover:bg-yellow-400/20 dark:text-yellow-200"
    case EtiquetteColor.LIME:
      return "bg-lime-200/50 hover:bg-lime-200/40 text-lime-900/90 shadow-lime-700/8 dark:bg-lime-400/25 dark:hover:bg-lime-400/20 dark:text-lime-200"
    default:
      return "bg-gray-200/50 hover:bg-gray-200/40 text-gray-900/90 shadow-gray-700/8 dark:bg-gray-400/25 dark:hover:bg-gray-400/20 dark:text-gray-200"
  }
}
export function getEtiquetteIndicatorColor(color?: EtiquetteColor): string {
  const eventColor = color ?? EtiquetteColor.GRAY

  switch (eventColor) {
    case EtiquetteColor.GRAY:
      return "bg-gray-400 dark:bg-gray-500"
    case EtiquetteColor.BLUE:
      return "bg-blue-500 dark:bg-blue-400"
    case EtiquetteColor.RED:
      return "bg-red-500 dark:bg-red-400"
    case EtiquetteColor.GREEN:
      return "bg-green-500 dark:bg-green-400"
    case EtiquetteColor.PURPLE:
      return "bg-purple-500 dark:bg-purple-400"
    case EtiquetteColor.ORANGE:
      return "bg-orange-500 dark:bg-orange-400"
    case EtiquetteColor.PINK:
      return "bg-pink-500 dark:bg-pink-400"
    case EtiquetteColor.TEAL:
      return "bg-teal-500 dark:bg-teal-400"
    case EtiquetteColor.YELLOW:
      return "bg-yellow-500 dark:bg-yellow-400"
    case EtiquetteColor.LIME:
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
    return "rounded" // Both ends rounded
  } else if (isFirstDay) {
    return "rounded-l rounded-r-none not-in-data-[slot=popover-content]:w-[calc(100%+5px)]" // Only left end rounded
  } else if (isLastDay) {
    return "rounded-r rounded-l-none not-in-data-[slot=popover-content]:w-[calc(100%+4px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"
  } else {
    return "rounded-none not-in-data-[slot=popover-content]:w-[calc(100%+9px)] not-in-data-[slot=popover-content]:-translate-x-[4px]"
  }
}

export function isMultiDayEvent(event: Events): boolean {
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)
  return event.all_day || eventStart.getDate() !== eventEnd.getDate()
}

export function getEventsForDay(events: Events[], day: Date): Events[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start)
      return isSameDay(day, eventStart)
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

export function sortEvents(events: Events[]): Events[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a)
    const bIsMultiDay = isMultiDayEvent(b)

    if (aIsMultiDay && !bIsMultiDay) return -1
    if (!aIsMultiDay && bIsMultiDay) return 1

    return new Date(a.start).getTime() - new Date(b.start).getTime()
  })
}

export function getSpanningEventsForDay(events: Events[], day: Date): Events[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) return false

    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    // Only include if it's not the start day but is either the end day or a middle day
    return (
      !isSameDay(day, eventStart) &&
      (isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
    )
  })
}

export function getAllEventsForDay(events: Events[], day: Date): Events[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    return (
      isSameDay(day, eventStart) ||
      isSameDay(day, eventEnd) ||
      (day > eventStart && day < eventEnd)
    )
  })
}

export function getAgendaEventsForDay(events: Events[], day: Date): Events[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      return (
        isSameDay(day, eventStart) ||
        isSameDay(day, eventEnd) ||
        (day > eventStart && day < eventEnd)
      )
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

export function addHoursToDate(date: Date, hours: number): Date {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}
