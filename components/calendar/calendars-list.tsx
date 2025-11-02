import { Calendar } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { getCalendars } from "@/lib/data/calendars/getCalendars"
import { CalendarItem } from "./calendar-item"

export async function CalendarsList() {
  const calendars = await getCalendars()

  return (
    <div className="p-6 md:p-10 lg:p-20">
      {calendars.length === 0 ? (
        <Empty className="py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Calendar />
            </EmptyMedia>
            <EmptyTitle>No hay calendarios disponibles</EmptyTitle>
            <EmptyDescription>
              No se encontraron calendarios públicos en el sistema.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {calendars.map((calendar) => (
            <CalendarItem key={calendar.$id} calendar={calendar} />
          ))}
        </div>
      )}
    </div>
  )
}
