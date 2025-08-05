"use client"

import {
  BookOpen,
  Building2,
  Calendar,
  Clock,
  Filter,
  FlaskConical,
  NotepadText,
  SquareUser,
  Star,
  TrendingUp,
  Users,
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

// Datos de ejemplo para el dashboard
const upcomingEvents = [
  {
    id: "1",
    title: "Conferencia de IA",
    time: "14:00",
    date: "Hoy",
    type: "academic",
    campus: "Bogotá",
  },
  {
    id: "2",
    title: "Taller de React",
    time: "16:00",
    date: "Mañana",
    type: "workshop",
    campus: "Bogotá",
  },
  {
    id: "3",
    title: "Festival Cultural",
    time: "18:00",
    date: "Viernes",
    type: "cultural",
    campus: "Medellín",
  },
]

const quickStats = [
  {
    title: "Eventos esta semana",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Calendar,
  },
  {
    title: "Horas de estudio",
    value: "24h",
    change: "+4h",
    trend: "up",
    icon: Clock,
  },
  {
    title: "Eventos favoritos",
    value: "12",
    change: "+3",
    trend: "up",
    icon: Star,
  },
  {
    title: "Participaciones",
    value: "15",
    change: "+5",
    trend: "up",
    icon: Users,
  },
]

const quickActions = [
  {
    title: "Mi calendario",
    description: "Ver calendario personal",
    href: "/dashboard/my-calendar",
    icon: Calendar,
    color: "bg-blue-500",
  },
  {
    title: "Eventos",
    description: "Explorar eventos disponibles",
    href: "/dashboard/events",
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    title: "Horarios",
    description: "Consultar horarios de servicios",
    href: "/dashboard/schedules",
    icon: Clock,
    color: "bg-purple-500",
  },
]

export default function DashboardHome() {
  const breadcrumbs = [
    { label: "Inicio", href: "/dashboard", isCurrentPage: true },
  ]

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col gap-4 px-40 py-6">
        <div className="space-y-20">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">¡Bienvenido de vuelta!</h1>
            <p className="text-muted-foreground">
              Aquí tienes un resumen de tu actividad universitaria
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat) => {
              const IconComponent = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <IconComponent className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-muted-foreground flex items-center text-xs">
                      <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                      {stat.change} desde la semana pasada
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Próximos Eventos */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>
                  Tus eventos más importantes de esta semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <Calendar className="text-primary h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {event.date} a las {event.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/events">Ver todos los eventos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Horarios Disponibles */}
            <Card>
              <CardHeader>
                <CardTitle>Horarios Disponibles</CardTitle>
                <CardDescription>
                  Acceso directo a todos los horarios universitarios con filtros
                  inteligentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto justify-start p-4"
                  >
                    <Link href="/dashboard/schedules/offices">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-blue-500 p-2 text-white">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Oficinas</p>
                          <p className="text-muted-foreground text-xs">
                            Horarios administrativos
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-auto justify-start p-4"
                  >
                    <Link href="/dashboard/schedules/professors">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-emerald-500 p-2 text-white">
                          <SquareUser className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Profesores</p>
                          <p className="text-muted-foreground text-xs">
                            Atención docente
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-auto justify-start p-4"
                  >
                    <Link href="/dashboard/schedules/labs">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-orange-500 p-2 text-white">
                          <FlaskConical className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Laboratorios</p>
                          <p className="text-muted-foreground text-xs">
                            Disponibilidad de labs
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-auto justify-start p-4"
                  >
                    <Link href="/dashboard/schedules/tutoring">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-violet-500 p-2 text-white">
                          <NotepadText className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Monitorías</p>
                          <p className="text-muted-foreground text-xs">
                            Apoyo académico
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                </div>

                <div className="mt-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-950 dark:to-indigo-950">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-blue-500 p-2 text-white">
                        <Filter className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">Sistema de Filtros</h4>
                        <p className="text-muted-foreground text-sm">
                          Filtros universitarios integrados
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="secondary" size="sm">
                      <Link href="/dashboard/schedules/university-demo">
                        Ver Demo
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Rápidas */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>
                  Accesos directos a las funciones principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon
                    return (
                      <Button
                        key={action.title}
                        asChild
                        variant="outline"
                        className="h-auto w-full justify-start p-4"
                      >
                        <Link href={action.href}>
                          <div className="flex items-center space-x-3">
                            <div
                              className={`rounded-lg p-2 ${action.color} text-white`}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">{action.title}</p>
                              <p className="text-muted-foreground text-xs">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información Útil */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recordatorios</CardTitle>
                <CardDescription>
                  No olvides estas fechas importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">
                        Inscripciones abiertas
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Materias electivas - Cierra el 15 de agosto
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Exámenes finales</p>
                      <p className="text-muted-foreground text-xs">
                        Período de exámenes - 20-30 de agosto
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg bg-green-50 p-3 dark:bg-green-950">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <p className="text-sm font-medium">Semana de receso</p>
                      <p className="text-muted-foreground text-xs">
                        Descanso académico - 2-6 de septiembre
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Noticias Universitarias</CardTitle>
                <CardDescription>
                  Últimas actualizaciones del campus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-primary border-l-2 pl-4">
                    <h4 className="font-medium">Nueva biblioteca digital</h4>
                    <p className="text-muted-foreground text-sm">
                      Acceso a más de 50,000 libros electrónicos disponibles
                    </p>
                    <p className="text-muted-foreground text-xs">Hace 2 días</p>
                  </div>
                  <div className="border-primary border-l-2 pl-4">
                    <h4 className="font-medium">Convocatoria de becas</h4>
                    <p className="text-muted-foreground text-sm">
                      Nuevas oportunidades de financiación para estudiantes
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Hace 1 semana
                    </p>
                  </div>
                  <div className="border-primary border-l-2 pl-4">
                    <h4 className="font-medium">Festival de ciencias</h4>
                    <p className="text-muted-foreground text-sm">
                      Muestra de proyectos estudiantiles el próximo mes
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Hace 2 semanas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
