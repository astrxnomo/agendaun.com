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
} from "@/components/ui/empty"

export function CalendarNotFound() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Calendarios", href: "/calendars" },
          { label: "No encontrado", isCurrentPage: true },
        ]}
      />

      <Empty className="min-h-[70vh] px-6 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarX2 />
          </EmptyMedia>
          <EmptyTitle className="text-2xl">Calendario no encontrado</EmptyTitle>
          <EmptyDescription>
            El calendario que buscas no existe o no tienes acceso a él.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button variant="outline" asChild>
            <Link href="/calendars">
              <ArrowLeft />
              Volver a Calendarios
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </>
  )
}
