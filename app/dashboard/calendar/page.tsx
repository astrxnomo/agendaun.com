import {
  Building2,
  CalendarDays,
  Flag,
  GraduationCap,
  MapPinHouse,
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

export default function CalendarPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Calendarioss", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Calendarios Académicos
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gestiona y visualiza eventos por nivel académico
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Calendario Nacional */}
          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Flag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Nacional</CardTitle>
                  <CardDescription>
                    Festividades y días festivos oficiales
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Calendario con fechas importantes a nivel nacional de Colombia,
                incluyendo días festivos y celebraciones oficiales.
              </p>
              <Button asChild className="w-full transition-transform">
                <Link href="/dashboard/calendar/national">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Ver Calendario Nacional
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Calendario de Sede */}
          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <MapPinHouse className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Sede</CardTitle>
                  <CardDescription>
                    Eventos específicos de tu sede
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Calendario con eventos, actividades y fechas importantes
                específicas de tu sede universitaria.
              </p>
              <Button asChild className="w-full transition-transform">
                <Link href="/dashboard/calendar/sede">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Ver Calendario de Sede
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Calendario de Facultad */}
          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Facultad</CardTitle>
                  <CardDescription>
                    Eventos académicos de tu facultad
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Calendario con eventos, conferencias y actividades específicas
                de tu facultad dentro de la universidad.
              </p>
              <Button asChild className="w-full transition-transform">
                <Link href="/dashboard/calendar/facultad">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Ver Calendario de Facultad
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Calendario de Programa */}
          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Programa</CardTitle>
                  <CardDescription>
                    Eventos académicos de tu carrera
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Calendario personalizado con eventos académicos específicos de
                tu programa de estudios.
              </p>
              <Button asChild className="w-full transition-transform">
                <Link href="/dashboard/calendar/programa">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Ver Calendario de Programa
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
