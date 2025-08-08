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
  Sparkles,
} from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
      <main className="flex flex-1 flex-col gap-10 px-4 py-6 md:px-10 lg:px-16 xl:px-24">
        {/* Hero introductorio */}
        <section className="bg-card rounded-xl border p-6 md:p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                <Sparkles className="text-primary h-3.5 w-3.5" />
                <span className="text-muted-foreground">Bienvenido a</span>
                <span className="font-medium">HorarioU</span>
              </div>
              <h1 className="mb-2 text-3xl leading-tight font-bold md:text-4xl">
                Organiza tu vida universitaria de forma sencilla
              </h1>
              <p className="text-muted-foreground text-base">
                Explora calendarios institucionales, consulta horarios de
                servicios y administra tu agenda personal desde un solo lugar.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/my-calendar">
                    Abrir mi calendario
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/calendar">Ver calendarios</Link>
                </Button>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Cómo empezar</CardTitle>
                  <CardDescription>
                    Tres pasos rápidos para sacarle provecho a HorarioU
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary mt-0.5 rounded-md p-1.5">
                      <BadgeCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Explora los calendarios
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Revisa el calendario nacional, por sede, facultad y
                        programa.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary mt-0.5 rounded-md p-1.5">
                      <BadgeCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Agrega tus eventos</p>
                      <p className="text-muted-foreground text-xs">
                        Crea recordatorios y añade actividades a tu calendario
                        personal.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary mt-0.5 rounded-md p-1.5">
                      <BadgeCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Consulta horarios</p>
                      <p className="text-muted-foreground text-xs">
                        Encuentra rápidamente horarios de atención y servicios.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Accesos rápidos</h2>
            <Badge variant="outline">{quickLinks.length} accesos</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Button
                  key={link.title}
                  asChild
                  variant="outline"
                  className="h-auto justify-start p-4"
                >
                  <Link href={link.href}>
                    <span className="bg-primary/10 text-primary mr-3 grid size-9 place-items-center rounded-md">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex min-w-0 flex-col text-left">
                      <span className="truncate font-medium">{link.title}</span>
                      <span className="text-muted-foreground text-xs">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </section>

        <Separator />

        {/* Secciones principales */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="text-primary h-5 w-5" />
                <CardTitle>Calendarios</CardTitle>
              </div>
              <CardDescription>
                Toda la información institucional en diferentes vistas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-muted-foreground list-inside list-disc text-sm">
                <li>Nacional: festivos y fechas país</li>
                <li>Sede: cronograma por campus</li>
                <li>Facultad y Programa: fechas académicas</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="/calendar">Ver todo</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/calendar/national">Nacional</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/calendar/sede">Sede</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/calendar/facultad">Facultad</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/calendar/programa">Programa</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="text-primary h-5 w-5" />
                <CardTitle>Horarios</CardTitle>
              </div>
              <CardDescription>
                Disponibilidades y atención de servicios universitarios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-muted-foreground list-inside list-disc text-sm">
                <li>Administrativos, docentes y laboratorios</li>
                <li>Acceso unificado por categorías</li>
              </ul>
              <Button asChild>
                <Link href="/schedules">Abrir horarios</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="bg-primary/10 pointer-events-none absolute -top-10 -right-10 size-28 rounded-full" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Rocket className="text-primary h-5 w-5" />
                <CardTitle>Tu espacio</CardTitle>
              </div>
              <CardDescription>
                Construye tu agenda personal con recordatorios y eventos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-muted-foreground list-inside list-disc text-sm">
                <li>Eventos personales y etiquetas</li>
                <li>Vistas diaria, semanal y mensual</li>
              </ul>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/my-calendar">Abrir mi calendario</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/calendar">Combinar con institucional</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tips y atajos */}
        <section className="bg-muted/30 rounded-xl border p-5 md:p-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-md">
                <Hand className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Atajos y consejos</p>
                <p className="text-muted-foreground text-sm">
                  Usa Cmd/Ctrl + B para mostrar u ocultar la barra lateral
                  rápidamente.
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              Consejo
            </Badge>
          </div>
        </section>
      </main>
    </>
  )
}
