import { Clock } from "lucide-react"
import Link from "next/link"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { getAllScheduleCategories } from "@/lib/data/schedules/getAllScheduleCategories"
import { getIcon } from "@/lib/utils"

export async function SchedulesCategories() {
  const categories = await getAllScheduleCategories()

  return (
    <div className="p-6 md:p-10 lg:p-20">
      {categories.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Clock className="h-12 w-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No hay horarios disponibles</EmptyTitle>
            <EmptyDescription>
              No se encontraron horarios en el sistema.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = getIcon(category.icon, Clock)
            return (
              <Item key={category.$id} className="bg-muted/40" asChild>
                <Link
                  href={`/schedules/${category.slug}`}
                  aria-label={`Ver horarios de ${category.name}`}
                >
                  <ItemMedia>
                    <div className="bg-primary/10 text-primary rounded-lg p-3">
                      <Icon className="h-6 w-6" />
                    </div>
                  </ItemMedia>

                  <ItemContent>
                    <ItemTitle className="text-lg font-semibold">
                      {category.name}
                    </ItemTitle>
                  </ItemContent>
                </Link>
              </Item>
            )
          })}
        </div>
      )}
    </div>
  )
}
