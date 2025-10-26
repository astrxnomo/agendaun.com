import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

import { getCalendars } from "@/lib/data/calendars/getCalendars"
import { getIcon } from "@/lib/utils"

export async function CalendarsContent() {
  const calendars = await getCalendars()

  return (
    <div className="p-6 md:p-10 lg:p-20">
      {calendars.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Calendar className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">
            No hay calendarios disponibles
          </h3>
          <p className="text-muted-foreground text-sm">
            No se encontraron calendarios públicos en el sistema.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {calendars.map((calendar) => {
            const Icon = getIcon(calendar.icon)
            return (
              <Link
                key={calendar.$id}
                href={`/calendars/${calendar.slug}`}
                className="group bg-muted/40 hover:border-primary/30 hover:bg-muted/60 relative overflow-hidden rounded-xl border border-transparent p-6 transition-all duration-200 hover:shadow-xl"
              >
                <div className="relative flex items-center gap-4">
                  <span className="bg-primary/10 text-primary rounded-lg p-3">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                    {calendar.name}
                  </h3>

                  <ArrowRight className="text-muted-foreground h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
