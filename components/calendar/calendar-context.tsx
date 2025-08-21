/**
 * @fileoverview Calendar Context - Date Management
 * @description Contexto simplificado para manejo de fechas compartidas entre todos los calendarios
 * @category UI Contexts
 */

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CalendarContextType {
  currentDate: Date
  setCurrentDate: (date: Date) => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
)

export function useCalendarContext() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error("useCalendarContext must be used within a CalendarProvider")
  }
  return context
}

interface CalendarProviderProps {
  children: ReactNode
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  return (
    <CalendarContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </CalendarContext.Provider>
  )
}
