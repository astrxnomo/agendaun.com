"use client"

import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  CalendarDays,
  Clock,
  Flag,
  GraduationCap,
  Hand,
  MapPinIcon as MapPinHouse,
  Rocket,
  School,
} from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function DashboardIntro() {
  const breadcrumbs = [{ label: "Inicio", href: "/", isCurrentPage: true }]

  const quickLinks = [
    {
      title: "Mi calendario",
      href: "/my-calendar",
      icon: Calendar,
      description: "Tu agenda personal y eventos",
    },
    {
      title: "Todos los calendarios",
      href: "/calendar",
      icon: CalendarDays,
      description: "Vista general institucional",
    },
    {
      title: "Calendario nacional",
      href: "/calendar/national",
      icon: Flag,
      description: "Festivos y fechas país",
    },
    {
      title: "Calendario por sede",
      href: "/calendar/sede",
      icon: MapPinHouse,
      description: "Cronograma por campus",
    },
    {
      title: "Calendario por facultad",
      href: "/calendar/facultad",
      icon: School,
      description: "Fechas académicas",
    },
    {
      title: "Calendario por programa",
      href: "/calendar/programa",
      icon: GraduationCap,
      description: "Fechas específicas",
    },
    {
      title: "Horarios",
      href: "/schedules",
      icon: Clock,
      description: "Servicios y atención",
    },
  ]

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <main className="flex flex-1 flex-col px-4 py-2 md:px-10 lg:px-16 xl:px-24">
        {/* Hero introductorio */}
        <section className="mb-16 overflow-hidden rounded px-8 py-12 md:px-12">
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h1 className="mb-4 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
                Organiza tu vida universitaria{" "}
                <span className="text-primary">de forma sencilla</span>
              </h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Explora calendarios institucionales, consulta horarios de
                servicios y administra tu agenda personal desde un solo lugar.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="rounded">
                  <Link href="/my-calendar">
                    Abrir mi calendario
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded">
                  <Link href="/calendar">Ver calendarios</Link>
                </Button>
              </div>
            </div>

            <div className="w-full max-w-sm">
              <div className="bg-background/60 rounded p-6 backdrop-blur-sm">
                <h3 className="mb-2 text-lg font-semibold">Cómo empezar</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Tres pasos rápidos para sacarle provecho a HorarioU
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary mt-1 rounded-lg p-2">
                      <BadgeCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Explora los calendarios</p>
                      <p className="text-muted-foreground text-sm">
                        Revisa el calendario nacional, por sede, facultad y
                        programa.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary mt-1 rounded-lg p-2">
                      <BadgeCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Agrega tus eventos</p>
                      <p className="text-muted-foreground text-sm">
                        Crea recordatorios y añade actividades a tu calendario
                        personal.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary mt-1 rounded-lg p-2">
                      <BadgeCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Consulta horarios</p>
                      <p className="text-muted-foreground text-sm">
                        Encuentra rápidamente horarios de atención y servicios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Accesos rápidos</h2>
              <p className="text-muted-foreground">
                Navega directamente a cualquier sección
              </p>
            </div>
            <Badge variant="secondary" className="rounded">
              {quickLinks.length} accesos
            </Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group bg-muted/30 hover:bg-muted/50 relative overflow-hidden rounded p-6 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="relative flex items-start gap-4">
                    <div className="text-primary rounded p-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="group-hover:text-primary font-semibold transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {link.description}
                      </p>
                    </div>
                    <ArrowRight className="text-muted-foreground h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Secciones principales */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Explora por categorías</h2>
            <p className="text-muted-foreground">
              Descubre todo lo que HorarioU tiene para ofrecerte
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Calendarios */}
            <div className="group bg-muted/30 rounded p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="text-primary rounded">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Calendarios</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Toda la información institucional en diferentes vistas
                organizadas por nivel.
              </p>
              <ul className="text-muted-foreground mb-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="bg-primary size-1.5 rounded" />
                  Nacional: festivos y fechas país
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary size-1.5 rounded" />
                  Sede: cronograma por campus
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary size-1.5 rounded" />
                  Facultad y Programa: fechas académicas
                </li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" className="rounded">
                  <Link href="/calendar">Ver todo</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded">
                  <Link href="/calendar/national">Nacional</Link>
                </Button>
              </div>
            </div>

            {/* Horarios */}
            <div className="group bg-muted/30 rounded p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="text-primary rounded">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Horarios</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Disponibilidades y atención de todos los servicios
                universitarios.
              </p>
              <ul className="text-muted-foreground mb-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="bg-primary size-1.5 rounded" />
                  Administrativos, docentes y laboratorios
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary size-1.5 rounded" />
                  Acceso unificado por categorías
                </li>
              </ul>
              <Button asChild className="rounded">
                <Link href="/schedules">Abrir horarios</Link>
              </Button>
            </div>

            {/* Tu espacio */}
            <div className="group bg-muted/30 relative overflow-hidden rounded p-8">
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-primary rounded">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Tu espacio</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Construye tu agenda personal con recordatorios y eventos
                  personalizados.
                </p>
                <ul className="text-muted-foreground mb-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="bg-primary size-1.5 rounded" />
                    Eventos personales y etiquetas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-primary size-1.5 rounded" />
                    Vistas diaria, semanal y mensual
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button asChild className="rounded">
                    <Link href="/my-calendar">Mi calendario</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded">
                    <Link href="/calendar">Combinar</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips y atajos */}
        <section className="rounded bg-gradient-to-r from-amber-50/50 via-orange-50/50 to-red-50/50 p-6 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="rounded bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                <Hand className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Atajos y consejos</h3>
                <p className="text-muted-foreground text-sm">
                  Usa{" "}
                  <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    Cmd/Ctrl + B
                  </kbd>{" "}
                  para mostrar u ocultar la barra lateral rápidamente.
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="rounded">
              Consejo
            </Badge>
          </div>
        </section>
      </main>
    </>
  )
}
