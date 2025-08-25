"use client"

import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Clock,
  GraduationCap,
  Landmark,
  School,
  University,
} from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DashboardIntro() {
  const quickLinks = [
    {
      title: "Mi calendario",
      href: "/calendars/my-calendar",
      icon: Calendar,
      description:
        "Tu espacio personal para organizar tus clases, eventos y recordatorios.",
    },
    {
      title: "Calendario Nacional",
      href: "/calendars/national",
      icon: Landmark,
      description: "Fechas y eventos importantes para toda la universidad.",
    },
    {
      title: "Calendario Sede",
      href: "/calendars/sede",
      icon: School,
      description: "Actividades y eventos exclusivos de tu sede.",
    },
    {
      title: "Calendario Facultad",
      href: "/calendars/faculty",
      icon: University,
      description: "Fechas clave y eventos propios de tu facultad.",
    },
    {
      title: "Calendario Programa",
      href: "/calendars/program",
      icon: GraduationCap,
      description:
        "Información y actividades específicas de tu programa académico.",
    },
    {
      title: "Horarios",
      href: "/schedules",
      icon: Clock,
      description: "Consulta horarios de clases, laboratorios, oficinas y más.",
    },
  ]

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Inicio", href: "/", isCurrentPage: true }]}
      />
      <main className="flex flex-1 flex-col items-center p-4 lg:p-10">
        {/* Hero introductorio */}
        <section className="from-primary/5 to-background mb-20 flex flex-col items-center gap-20 overflow-hidden rounded bg-gradient-to-br px-8 py-14 md:flex-row md:px-16">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
              Mantente al día de lo que pasa en la{" "}
              <span className="text-primary">U</span> con
              <span className="text-primary"> AgendaUN</span>
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Explora eventos y fechas clave por sede, facultad o programa. Y
              crea tu propio calendario personal para no perderte de nada.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="rounded shadow">
                <Link href="/calendars/my-calendar">
                  Ir a mi calendario
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded bg-transparent"
              >
                <Link href="/calendars">Explorar otros calendarios</Link>
              </Button>
            </div>
          </div>
          <div className="hidden w-full max-w-sm lg:block">
            <div className="bg-background/70 rounded p-8 shadow-lg backdrop-blur-sm">
              <h3 className="mb-2 text-lg font-semibold">
                Cómo aprovechar AgendaUN
              </h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Tres pasos para mantenerte siempre al día
              </p>
              <ol className="list-inside list-decimal space-y-4">
                <li className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary mt-1 rounded-lg p-2">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="font-medium">
                      Elige el calendario que necesitas
                    </span>
                    <span className="text-muted-foreground block text-sm">
                      Nacional, sede, facultad o programa: accede a la
                      información que te importa.
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary mt-1 rounded-lg p-2">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="font-medium">
                      Personaliza tu calendario
                    </span>
                    <span className="text-muted-foreground block text-sm">
                      Añade tus propias clases, reuniones o recordatorios en “Mi
                      calendario”.
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary/20 text-primary mt-1 rounded-lg p-2">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="font-medium">
                      Consulta horarios de todo
                    </span>
                    <span className="text-muted-foreground block text-sm">
                      Clases, bibliotecas, oficinas, laboratorios y más, siempre
                      actualizados.
                    </span>
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className="mb-20 md:px-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Accesos rápidos</h2>
              <p className="text-muted-foreground">
                Encuentra de inmediato el calendario o información que necesitas
              </p>
            </div>
            <Badge variant="secondary" className="rounded">
              {quickLinks.length} accesos
            </Badge>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group bg-muted/40 hover:bg-muted/60 hover:border-primary/30 relative overflow-hidden rounded border border-transparent p-6 transition-all duration-200 hover:shadow-xl"
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
                    </span>
                    <ArrowRight className="text-muted-foreground h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </>
  )
}
