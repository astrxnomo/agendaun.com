import { ArrowRight } from "lucide-react"
import Link from "next/link"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import type { Calendars } from "@/lib/data/types"
import { getIcon } from "@/lib/utils"

interface CalendarItemProps {
  calendar: Calendars
}

export function CalendarItem({ calendar }: CalendarItemProps) {
  const Icon = getIcon(calendar.icon)

  return (
    <Item className="bg-muted/40 hover:border-primary/30" asChild>
      <Link
        href={`/calendars/${calendar.slug}`}
        aria-label={`Ver calendario ${calendar.name}`}
      >
        <ItemMedia>
          <div className="bg-primary/10 text-primary rounded p-3">
            <Icon className="h-6 w-6" />
          </div>
        </ItemMedia>

        <ItemContent>
          <ItemTitle className="text-lg font-semibold">
            {calendar.name}
          </ItemTitle>
        </ItemContent>

        <ItemActions>
          <ArrowRight className="text-muted-foreground h-4 w-4" />
        </ItemActions>
      </Link>
    </Item>
  )
}
