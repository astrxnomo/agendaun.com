import { ArrowLeft, CalendarX2 } from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../ui/empty"

export function ScheduleNotFound() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Horarios", href: "/schedules" },
          { label: "No encontrado", isCurrentPage: true },
        ]}
      />

      <Empty className="min-h-[70vh] px-6 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarX2 />
          </EmptyMedia>
          <EmptyTitle className="text-2xl">Horario no encontrado</EmptyTitle>
          <EmptyDescription>
            El horario que buscas no existe o no tienes acceso a él.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button variant="outline" asChild>
            <Link href="/schedules">
              <ArrowLeft />
              Volver a Horarios
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </>
  )
}
