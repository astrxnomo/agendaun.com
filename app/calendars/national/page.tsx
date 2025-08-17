import { type CalendarEvent, type Etiquette } from "@/components/calendar"
import NationalCalendar from "@/components/calendars/national-calendar"
import { PageHeader } from "@/components/page-header"
import { getCalendar } from "@/lib/data/calendars"
import { getEtiquettes } from "@/lib/data/etiquettes"
import { getEvents } from "@/lib/data/events"

export default async function NationalCalendarPage() {
  const calendar = await getCalendar("national")
  const events = await getEvents("national")
  const etiquettes = await getEtiquettes("national")

  const nationalEvents: CalendarEvent[] = [
    {
      id: "regreso-clases-agosto",
      title: "Inicio de Clases Segundo Semestre",
      description: "Inicio del período académico 2025-2",
      start: new Date(2025, 7, 1), // 1 agosto 2025
      end: new Date(2025, 7, 1),
      allDay: true,
      color: "green",
    },
    {
      id: "jornada-vacunacion-agosto",
      title: "Jornada Nacional de Vacunación",
      description: "Campaña nacional de vacunación estudiantil",
      start: new Date(2025, 7, 5), // 5 agosto 2025
      end: new Date(2025, 7, 5),
      allDay: true,
      color: "red",
    },
    {
      id: "batalla-boyaca",
      title: "Batalla de Boyacá",
      description: "Conmemoración de la Batalla de Boyacá",
      start: new Date(2025, 7, 7), // 7 agosto 2025
      end: new Date(2025, 7, 7),
      allDay: true,
      color: "blue",
    },
    {
      id: "semana-ciencia-agosto",
      title: "Semana Nacional de la Ciencia",
      description: "Eventos y actividades científicas en todo el país",
      start: new Date(2025, 7, 12), // 12 agosto 2025
      end: new Date(2025, 7, 16), // 16 agosto 2025
      allDay: true,
      color: "purple",
    },
    {
      id: "asuncion",
      title: "Asunción de la Virgen",
      description: "Festividad religiosa católica",
      start: new Date(2025, 7, 18), // 18 agosto 2025
      end: new Date(2025, 7, 18),
      allDay: true,
      color: "purple",
    },
    {
      id: "dia-juventud-agosto",
      title: "Día Nacional de la Juventud",
      description: "Celebración y actividades para jóvenes universitarios",
      start: new Date(2025, 7, 24), // 24 agosto 2025
      end: new Date(2025, 7, 24),
      allDay: true,
      color: "orange",
    },
    {
      id: "foro-educacion-agosto",
      title: "Foro Nacional de Educación Superior",
      description: "Encuentro nacional de rectores y directivos universitarios",
      start: new Date(2025, 7, 28), // 28 agosto 2025
      end: new Date(2025, 7, 30), // 30 agosto 2025
      allDay: true,
      color: "blue",
    },
    {
      id: "dia-raza",
      title: "Día de la Raza",
      description: "Conmemoración del encuentro de dos mundos",
      start: new Date(2025, 9, 13), // 13 octubre 2025
      end: new Date(2025, 9, 13),
      allDay: true,
      color: "orange",
    },
    {
      id: "todos-santos",
      title: "Día de Todos los Santos",
      description: "Festividad religiosa católica",
      start: new Date(2025, 10, 3), // 3 noviembre 2025
      end: new Date(2025, 10, 3),
      allDay: true,
      color: "purple",
    },
    {
      id: "independencia-cartagena",
      title: "Independencia de Cartagena",
      description: "Conmemoración de la independencia de Cartagena",
      start: new Date(2025, 10, 17), // 17 noviembre 2025
      end: new Date(2025, 10, 17),
      allDay: true,
      color: "blue",
    },
    {
      id: "inmaculada",
      title: "Inmaculada Concepción",
      description: "Festividad religiosa católica",
      start: new Date(2025, 11, 8), // 8 diciembre 2025
      end: new Date(2025, 11, 8),
      allDay: true,
      color: "purple",
    },
    {
      id: "navidad",
      title: "Navidad",
      description: "Celebración del nacimiento de Jesucristo",
      start: new Date(2025, 11, 25), // 25 diciembre 2025
      end: new Date(2025, 11, 25),
      allDay: true,
      color: "pink",
    },
    {
      id: "new-year-2026",
      title: "Año Nuevo 2026",
      description: "Celebración del inicio del nuevo año",
      start: new Date(2026, 0, 1), // 1 enero 2026
      end: new Date(2026, 0, 1),
      allDay: true,
      color: "blue",
    },
    {
      id: "reyes-magos-2026",
      title: "Día de los Reyes Magos",
      description: "Festividad religiosa tradicional",
      start: new Date(2026, 0, 6), // 6 enero 2026
      end: new Date(2026, 0, 6),
      allDay: true,
      color: "purple",
    },
    {
      id: "san-jose-2026",
      title: "Día de San José",
      description: "Festividad religiosa católica",
      start: new Date(2026, 2, 23), // 23 marzo 2026 (trasladado al lunes)
      end: new Date(2026, 2, 23),
      allDay: true,
      color: "purple",
    },
  ]

  // Etiquetas específicas para calendario nacional
  const nationalEtiquettes: Etiquette[] = [
    {
      id: "academico",
      name: "Académico",
      color: "blue",
      isActive: true,
    },
    {
      id: "deportivo",
      name: "Deportivo",
      color: "green",
      isActive: true,
    },
    {
      id: "cultural",
      name: "Cultural",
      color: "orange",
      isActive: true,
    },
    {
      id: "social",
      name: "Social",
      color: "purple",
      isActive: true,
    },
    {
      id: "administrativo",
      name: "Administrativo",
      color: "red",
      isActive: true,
    },
    {
      id: "bienestar",
      name: "Bienestar",
      color: "pink",
      isActive: true,
    },
    {
      id: "test3",
      name: "Bienestar",
      color: "teal",
      isActive: true,
    },
    {
      id: "test2",
      name: "Bienestar",
      color: "yellow",
      isActive: true,
    },
    {
      id: "test1",
      name: "Bienestar",
      color: "lime",
      isActive: true,
    },
    {
      id: "sin-etiqueta",
      name: "Sin etiqueta",
      color: "gray",
      isActive: true,
    },
  ]

  if (!calendar || !events || !etiquettes) {
    return <div>No se encontraron datos</div>
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", href: "/calendars" },
          { label: "Nacional", isCurrentPage: true },
        ]}
      />
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">Calendario Nacional</h1>
        <p className="text-muted-foreground mt-2">
          Festividades y días festivos oficiales de Colombia
        </p>
      </div>
      <NationalCalendar
        userRole="user"
        events={nationalEvents}
        etiquettes={nationalEtiquettes}
      />
    </>
  )
}
