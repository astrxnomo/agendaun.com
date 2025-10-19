import { Skeleton } from "@/components/ui/skeleton"

// Generate deterministic event positions for schedule skeleton
const generateScheduleEvents = () => {
  // Deterministic pattern for each day (7 days)
  const pattern = [
    // Monday
    [
      { startHour: 2, duration: 2 }, // 8:00-10:00
      { startHour: 7, duration: 1 }, // 13:00-14:00
    ],
    // Tuesday
    [
      { startHour: 4, duration: 3 }, // 10:00-13:00
      { startHour: 9, duration: 1 }, // 15:00-16:00
    ],
    // Wednesday
    [
      { startHour: 1, duration: 2 }, // 7:00-9:00
      { startHour: 5, duration: 2 }, // 11:00-13:00
    ],
    // Thursday
    [
      { startHour: 3, duration: 2 }, // 9:00-11:00
      { startHour: 8, duration: 1 }, // 14:00-15:00
    ],
    // Friday
    [
      { startHour: 2, duration: 3 }, // 8:00-11:00
      { startHour: 6, duration: 2 }, // 12:00-14:00
    ],
    // Saturday
    [{ startHour: 4, duration: 2 }], // 10:00-12:00
    // Sunday
    [], // No events
  ]
  return pattern
}

export function ScheduleSkeleton() {
  const scheduleEvents = generateScheduleEvents()

  return (
    <div className="flex h-full flex-col">
      {/* PageHeader Skeleton */}
      <header className="flex h-12 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </header>

      {/* Schedule Header Skeleton */}
      <div className="border-b px-6 py-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-40" />
      </div>

      {/* Days Header */}
      <div className="border-border/70 grid grid-cols-8 border-b uppercase">
        <div className="border-border/70 border-r" />
        {["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"].map((day) => (
          <div
            key={day}
            className="text-muted-foreground/70 py-2 text-center text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Schedule Grid Skeleton */}
      <div className="grid grid-cols-8">
        {/* Hours column */}
        <div className="border-border/70 border-r">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="border-border/70 h-[72px] border-b last:border-b-0"
            />
          ))}
        </div>

        {/* Day columns with deterministic events */}
        {scheduleEvents.map((dayEvents, dayIndex) => (
          <div
            key={dayIndex}
            className="border-border/70 relative border-r last:border-r-0"
          >
            {/* Hour lines */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="border-border/70 h-[72px] border-b last:border-b-0"
              />
            ))}

            {/* Event skeletons */}
            {dayEvents.map((event, eventIndex) => (
              <Skeleton
                key={`event-${dayIndex}-${eventIndex}`}
                className="absolute right-1 left-1 rounded-md opacity-70"
                style={{
                  top: `${event.startHour * 72}px`,
                  height: `${event.duration * 72 - 4}px`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
