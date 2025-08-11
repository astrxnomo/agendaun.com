"use client"

import {
  ArrowRight,
  BookMarked,
  Building2,
  Bus,
  FlaskConical,
  NotepadText,
  SquareUser,
} from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"

const scheduleLinks = [
  {
    title: "Oficinas",
    href: "/schedules/offices",
    icon: Building2,
    description: "Horarios de atención de oficinas administrativas",
    details:
      "Consulta los horarios de atención y servicios de las oficinas administrativas de la universidad.",
    cta: "Ver Horarios de Oficinas",
  },
  {
    title: "Profesores",
    href: "/schedules/professors",
    icon: SquareUser,
    description: "Horarios de atención y oficina de profesores",
    details:
      "Encuentra los horarios de consulta y ubicación de los profesores para asesorías y atención académica.",
    cta: "Ver Horarios de Profesores",
  },
  {
    title: "Monitorías",
    href: "/schedules/tutoring",
    icon: NotepadText,
    description: "Horarios de monitorías y tutorías académicas",
    details:
      "Accede a los horarios de monitorías y tutorías para apoyo académico en distintas asignaturas.",
    cta: "Ver Horarios de Monitorías",
  },
  {
    title: "Laboratorios",
    href: "/schedules/labs",
    icon: FlaskConical,
    description: "Horarios de disponibilidad de laboratorios",
    details:
      "Consulta la disponibilidad y horarios de uso de los laboratorios universitarios.",
    cta: "Ver Horarios de Laboratorios",
  },
  {
    title: "Bibliotecas",
    href: "/services/library",
    icon: BookMarked,
    description: "Horarios de atención de bibliotecas",
    details:
      "Revisa los horarios de apertura y cierre de las bibliotecas universitarias.",
    cta: "Ver Horarios de Bibliotecas",
  },
  {
    title: "Transportes",
    href: "/services/transport",
    icon: Bus,
    description: "Horarios de rutas de transporte universitario",
    details:
      "Consulta los horarios y rutas del transporte universitario para estudiantes y personal.",
    cta: "Ver Horarios de Transporte",
  },
]

export default function SchedulesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Horarios", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Horarios</h1>
        <p className="text-muted-foreground mt-2">
          Accede a todos los horarios de servicios universitarios
        </p>
      </div>

      <div className="p-6 md:p-10 lg:p-20">
        <div className="grid gap-6 md:grid-cols-2">
          {scheduleLinks.map((link) => {
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
