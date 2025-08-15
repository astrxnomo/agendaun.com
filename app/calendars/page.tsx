"use client"

import {
  ArrowRight,
  GraduationCap,
  Landmark,
  School,
  University,
} from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"

const calendarLinks = [
  {
    title: "Nacional",
    href: "/calendars/national",
    icon: Landmark,
    description: "Festividades y días festivos oficiales",
    details:
      "Calendario con fechas importantes a nivel nacional de Colombia, incluyendo días festivos y celebraciones oficiales.",
    cta: "Ver Calendario Nacional",
  },
  {
    title: "Sede",
    href: "/calendars/sede",
    icon: School,
    description: "Eventos específicos de tu sede",
    details:
      "Calendario con eventos, actividades y fechas importantes específicas de tu sede universitaria.",
    cta: "Ver Calendario de Sede",
  },
  {
    title: "Facultad",
    href: "/calendars/facultad",
    icon: University,
    description: "Eventos académicos de tu facultad",
    details:
      "Calendario con eventos, conferencias y actividades específicas de tu facultad dentro de la universidad.",
    cta: "Ver Calendario de Facultad",
  },
  {
    title: "Programa",
    href: "/calendars/programa",
    icon: GraduationCap,
    description: "Eventos académicos de tu carrera",
    details:
      "Calendario personalizado con eventos académicos específicos de tu programa de estudios.",
    cta: "Ver Calendario de Programa",
  },
]

export default function Page() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Calendarios Académicos</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona y visualiza eventos por nivel académico
        </p>
      </div>

      <div className="p-6 md:p-10 lg:p-20">
        <div className="grid gap-6 md:grid-cols-2">
          {calendarLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.title}
                href={link.href}
                className="group bg-muted/40 hover:bg-muted/60 hover:border-primary/30 relative overflow-hidden rounded-xl border border-transparent p-6 transition-all duration-200 hover:shadow-xl"
              >
                <div className="relative flex items-start gap-4">
                  <span className="bg-primary/10 text-primary rounded-lg p-3">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {link.description}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs">
                      {link.details}
                    </p>
                  </span>
                  <ArrowRight className="text-muted-foreground h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
