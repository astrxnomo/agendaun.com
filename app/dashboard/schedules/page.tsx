"use client"

import {
  BookMarked,
  Building2,
  Bus,
  Clock,
  FlaskConical,
  NotepadText,
  SquareUser,
} from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const scheduleCategories = [
  {
    title: "Oficinas",
    description: "Horarios de atención de oficinas administrativas",
    icon: Building2,
    href: "/dashboard/schedules/offices",
    color: "bg-blue-500",
  },
  {
    title: "Profesores",
    description: "Horarios de atención y oficina de profesores",
    icon: SquareUser,
    href: "/dashboard/schedules/professors",
    color: "bg-green-500",
  },
  {
    title: "Monitorías",
    description: "Horarios de monitorías y tutorías académicas",
    icon: NotepadText,
    href: "/dashboard/schedules/tutoring",
    color: "bg-purple-500",
  },
  {
    title: "Laboratorios",
    description: "Horarios de disponibilidad de laboratorios",
    icon: FlaskConical,
    href: "/dashboard/schedules/labs",
    color: "bg-orange-500",
  },
  {
    title: "Bibliotecas",
    description: "Horarios de atención de bibliotecas",
    icon: BookMarked,
    href: "/dashboard/services/library",
    color: "bg-indigo-500",
  },
  {
    title: "Transportes",
    description: "Horarios de rutas de transporte universitario",
    icon: Bus,
    href: "/dashboard/services/transport",
    color: "bg-red-500",
  },
]

export default function SchedulesPage() {
  const breadcrumbs = [
    { label: "Inicio", href: "/dashboard" },
    { label: "Horarios", href: "/dashboard/schedules", isCurrentPage: true },
  ]

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col gap-4 px-6 py-6 xl:px-40">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Horarios</h1>
            <p className="text-muted-foreground">
              Accede a todos los horarios de servicios universitarios
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scheduleCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.title}
                  className="transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${category.color} text-white`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>{category.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={category.href}>
                        <Clock className="mr-2 h-4 w-4" />
                        Ver Horarios
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
