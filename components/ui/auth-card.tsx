import { CalendarSkeletonBackground } from "@/components/auth/skeleton-background"
import { Card, CardContent } from "@/components/ui/card"

import type { ReactNode } from "react"

type AuthCardProps = {
  children: ReactNode
  showBackground?: boolean
  compact?: boolean
}

export function AuthCard({
  children,
  showBackground = true,
  compact = false,
}: AuthCardProps) {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden px-6 py-6">
      {showBackground && (
        <div className="pointer-events-none absolute inset-0 opacity-60 blur-xs">
          <CalendarSkeletonBackground />
        </div>
      )}

      <Card className="border-border/50 bg-background/95 relative z-10 w-full max-w-md backdrop-blur-md">
        <CardContent
          className={`text-center ${compact ? "space-y-6 p-6" : "space-y-8 p-8"}`}
        >
          {children}
        </CardContent>
      </Card>
    </main>
  )
}

type IconWrapperProps = {
  children: ReactNode
  color?: "primary" | "amber" | "yellow"
  animate?: boolean
}

export function AuthIcon({
  children,
  color = "primary",
  animate = false,
}: IconWrapperProps) {
  const colors = {
    primary:
      "bg-primary/10 border-primary/10 from-primary/5 to-primary/10 text-primary",
    amber:
      "bg-amber-500/10 border-amber-500/20 from-amber-500/5 to-amber-500/10 text-amber-600 dark:text-amber-400",
    yellow:
      "bg-yellow-500/10 dark:bg-yellow-400/10 border-yellow-500/20 dark:border-yellow-400/20 from-yellow-500/5 to-yellow-500/10 dark:from-yellow-400/5 dark:to-yellow-400/10 text-yellow-600 dark:text-yellow-400",
  }

  return (
    <div className="flex justify-center">
      <div className="relative">
        <div
          className={`absolute inset-0 scale-150 rounded-full blur-xl ${colors[color].split(" ")[0]}`}
        />
        <div
          className={`relative rounded-2xl border bg-gradient-to-br p-6 shadow-sm ${animate ? "animate-pulse" : ""} ${colors[color]}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

type AuthContentProps = {
  title: string
  description: string
}

export function AuthContent({ title, description }: AuthContentProps) {
  return (
    <div className="space-y-3">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground mx-auto text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export function AuthFooter({ children }: { children: ReactNode }) {
  return (
    <div className="border-border/30 border-t pt-4 text-center">
      <p className="text-muted-foreground/80 text-xs">{children}</p>
    </div>
  )
}
