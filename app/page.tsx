import {
  ArrowRight,
  Calendar,
  CalendarDays,
  Clock,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DashboardIntro() {
  const features = [
    {
      title: "Calendario Personal",
      description:
        "Organiza tus clases, eventos y recordatorios en un solo lugar.",
      icon: Calendar,
      href: "/calendars/personal",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-primary/20 to-primary/10",
      hoverBg: "group-hover:from-primary/30 group-hover:to-primary/20",
    },
    {
      title: "Calendario Universitario",
      description:
        "Eventos institucionales de tu sede, facultad y programa académico.",
      icon: CalendarDays,
      href: "/calendars/unal",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-primary/20 to-primary/10",
      hoverBg: "group-hover:from-primary/30 group-hover:to-primary/20",
    },
    {
      title: "Horarios",
      description:
        "Consulta horarios académicos, deportes, cultura y bienestar.",
      icon: Clock,
      href: "/schedules",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-primary/20 to-primary/10",
      hoverBg: "group-hover:from-primary/30 group-hover:to-primary/20",
    },
  ]

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Inicio", href: "/", isCurrentPage: true }]}
      />
      <main className="flex flex-1 flex-col gap-8 p-4 md:gap-12 md:p-8 lg:p-12">
        <section className="relative flex flex-col items-center justify-center gap-6 py-12 text-center md:py-20">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="bg-primary/5 absolute top-10 left-1/4 h-72 w-72 animate-pulse rounded-full blur-3xl" />
            <div className="bg-primary/5 animation-delay-2000 absolute top-20 right-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
            <div className="bg-primary/5 animation-delay-4000 absolute bottom-10 left-1/3 h-80 w-80 animate-pulse rounded-full blur-3xl" />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 from-primary/10 via-primary/5 to-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm duration-700">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text font-semibold text-transparent">
              Plataforma de gestión universitaria
            </span>
          </div>

          <h1 className="animate-in fade-in slide-in-from-bottom-6 max-w-4xl text-4xl font-bold tracking-tight duration-1000 md:text-5xl lg:text-6xl">
            Mantente al día en{" "}
            <span className="from-primary via-primary/80 to-primary/60 animate-in bg-gradient-to-r bg-clip-text text-transparent">
              un solo lugar
            </span>
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-8 animation-delay-200 text-muted-foreground max-w-2xl text-lg duration-1000 md:text-xl">
            Accede a calendarios, horarios y eventos de la Universidad Nacional
            de Colombia. Todo organizado y personalizado para ti.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-10 animation-delay-300 mt-6 flex flex-wrap items-center justify-center gap-4 duration-1000">
            <Button
              size="lg"
              asChild
              className="group shadow-primary/25 hover:shadow-primary/40 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Link href="/calendars/personal">
                <Calendar className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Ir a mi calendario
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="group hover:border-primary/50 hover:bg-primary/5 transition-all hover:scale-105"
            >
              <Link href="/calendars/unal">
                Explorar Calendario UNAL
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Cards */}
        <section className="mx-auto w-full max-w-6xl">
          <div className="animate-in fade-in slide-in-from-bottom-4 mb-8 text-center duration-700">
            <h2 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
              ¿Qué puedes hacer?
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Herramientas diseñadas para tu vida universitaria
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const delay = `animation-delay-${(index + 1) * 100}`
              return (
                <Link key={feature.title} href={feature.href}>
                  <Card
                    className={`animate-in fade-in slide-in-from-bottom-8 duration-700 ${delay} hover:border-primary/50 group hover:shadow-primary/20 relative h-full overflow-hidden border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <CardHeader>
                      <div
                        className={`${feature.bgColor} ${feature.hoverBg} mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}
                      >
                        <Icon
                          className={`h-7 w-7 ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                        />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-primary flex items-center text-sm font-semibold">
                        Explorar
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="animate-in fade-in zoom-in animation-delay-600 from-primary/20 via-primary/10 to-primary/5 relative mx-auto mt-15 w-full max-w-6xl overflow-hidden rounded-2xl bg-gradient-to-br p-8 text-center shadow-2xl backdrop-blur-sm duration-700 md:p-12">
          {/* Animated background gradient */}
          <div className="from-primary/10 to-primary/5 absolute inset-0 animate-pulse bg-gradient-to-br via-transparent" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold">
              ¿Listo para{" "}
              <span className="from-primary via-primary/80 to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                organizarte mejor
              </span>
              ?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              Configura tu perfil universitario y empieza a ver contenido
              personalizado de tu sede, facultad y programa.
            </p>
            <Button
              size="lg"
              asChild
              className="group shadow-primary/30 hover:shadow-primary/50 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              <Link href="/calendars/personal">
                Comenzar ahora
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  )
}
