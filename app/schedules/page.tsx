import {
  ArrowRight,
  BookOpen,
  Building2,
  Bus,
  Clock,
  FlaskConical,
  GraduationCap,
  MapPin,
  Stethoscope,
  Users,
  Utensils,
  Wifi,
} from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { getAllScheduleCategories } from "@/lib/actions/schedule/schedules.actions"

export default async function SchedulesPage() {
  const categories = await getAllScheduleCategories()

  const getIconForCategory = (iconName: string | null) => {
    if (!iconName) return Clock

    switch (iconName) {
      case "GraduationCap":
        return GraduationCap
      case "Users":
        return Users
      case "Building2":
        return Building2
      case "FlaskConical":
        return FlaskConical
      case "BookOpen":
        return BookOpen
      case "Bus":
        return Bus
      case "Utensils":
        return Utensils
      case "Stethoscope":
        return Stethoscope
      case "Wifi":
        return Wifi
      case "MapPin":
        return MapPin
      default:
        return Clock
    }
  }

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
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Clock className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="text-lg font-semibold">
              No hay horarios disponibles
            </h3>
            <p className="text-muted-foreground text-sm">
              No se encontraron horarios en el sistema.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = getIconForCategory(category.icon)
              return (
                <Link
                  key={category.$id}
                  href={`/schedules/${category.slug}`}
                  className="group bg-muted/40 hover:border-primary/30 hover:bg-muted/60 block overflow-hidden rounded-xl border border-transparent p-6 transition-all duration-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="bg-primary/10 text-primary rounded-lg p-3">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <ArrowRight className="text-muted-foreground h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
