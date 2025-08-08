"use client"

import {
  Building2,
  CalendarDays,
  Flag,
  GraduationCap,
  MapPinIcon as MapPinHouse,
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
          {/* Calendario Nacional */}
          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Flag className="text-primary h-6 w-6" />
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
              <p className="text-smtext-muted-foreground mb-4">
                Calendario con fechas importantes a nivel nacional de Colombia,
                incluyendo días festivos y celebraciones oficiales.
              </p>
              <Button asChild className="w-full transition-transform">
                <Link href="/calendar/national">
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
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <MapPinHouse className="text-primary h-6 w-6" />
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
              <p className="text-smtext-muted-foreground mb-4">
                Calendario con eventos, actividades y fechas importantes
                específicas de tu sede universitaria.
              </p>
              <Button asChild className="w-full transition-transform">
                <Link href="/calendar/sede">
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
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Building2 className="text-primary h-6 w-6" />
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
              <p className="text-smtext-muted-foreground mb-4">
                Calendario con eventos, conferencias y actividades específicas
                de tu facultad dentro de la universidad.
              </p>
              <Button asChild className="w-full transition-transform">
                <Link href="/calendar/facultad">
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
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <GraduationCap className="text-primary h-6 w-6" />
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
              <p className="text-smtext-muted-foreground mb-4">
                Calendario personalizado con eventos académicos específicos de
                tu programa de estudios.
              </p>
              <Button asChild className="w-full transition-transform">
                <Link href="/calendar/programa">
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
