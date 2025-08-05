"use client"

import { CalendarDays, Clock, MapPin, Users } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Event {
  id: string
  title: string
  description: string
  type: "academic" | "cultural" | "sports" | "conferences" | "workshops"
  date: string
  time: string
  location: string
  capacity?: number
  registered?: number
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Conferencia de Ingeniería de Software",
    description:
      "Una conferencia sobre las últimas tendencias en desarrollo de software",
    type: "conferences",
    date: "2024-08-15",
    time: "14:00",
    location: "Auditorio Principal",
    capacity: 200,
    registered: 150,
  },
  {
    id: "2",
    title: "Taller de Machine Learning",
    description: "Aprende los fundamentos del aprendizaje automático",
    type: "workshops",
    date: "2024-08-18",
    time: "09:00",
    location: "Laboratorio de Sistemas",
    capacity: 30,
    registered: 25,
  },
  {
    id: "3",
    title: "Festival Cultural Universitario",
    description: "Celebración de la diversidad cultural de la universidad",
    type: "cultural",
    date: "2024-08-20",
    time: "16:00",
    location: "Plaza Central",
    capacity: 500,
    registered: 320,
  },
  {
    id: "4",
    title: "Torneo de Fútbol Interfacultades",
    description: "Competencia deportiva entre las diferentes facultades",
    type: "sports",
    date: "2024-08-22",
    time: "10:00",
    location: "Cancha de Fútbol",
    capacity: 100,
    registered: 80,
  },
  {
    id: "5",
    title: "Semana de la Investigación",
    description: "Presentación de proyectos de investigación estudiantil",
    type: "academic",
    date: "2024-08-25",
    time: "08:00",
    location: "Centro de Convenciones",
    capacity: 300,
    registered: 180,
  },
]

const typeLabels = {
  academic: "Académicos",
  cultural: "Culturales",
  sports: "Deportivos",
  conferences: "Conferencias",
  workshops: "Talleres",
}

const typeColors = {
  academic: "bg-blue-500",
  cultural: "bg-purple-500",
  sports: "bg-green-500",
  conferences: "bg-orange-500",
  workshops: "bg-red-500",
}

export default function EventsPage() {
  const searchParams = useSearchParams()
  const eventType = searchParams.get("type") as keyof typeof typeLabels | null
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents)

  useEffect(() => {
    if (eventType && eventType in typeLabels) {
      setFilteredEvents(mockEvents.filter((event) => event.type === eventType))
    } else {
      setFilteredEvents(mockEvents)
    }
  }, [eventType])

  const pageTitle =
    eventType && eventType in typeLabels
      ? `Eventos ${typeLabels[eventType]}`
      : "Todos los Eventos"

  const breadcrumbs = [
    { label: "Inicio", href: "/dashboard" },
    { label: "Eventos", href: "/dashboard/events", isCurrentPage: !eventType },
    ...(eventType
      ? [{ label: typeLabels[eventType], isCurrentPage: true }]
      : []),
  ]

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />

      <div className="flex flex-1 flex-col gap-4 px-6 py-6 xl:px-40">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">
              Descubre y participa en los eventos de la universidad
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <Badge className={`${typeColors[event.type]} text-white`}>
                      {typeLabels[event.type]}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    {event.capacity && (
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        {event.registered}/{event.capacity} inscritos
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay eventos disponibles para esta categoría.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
