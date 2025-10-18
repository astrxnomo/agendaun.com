import { Card, CardContent } from "@/components/ui/card"
import { StatusSkeletonBackground } from "@/components/ui/status-skeleton-background"

import type { ReactNode } from "react"

export function StatusCard({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden px-6 py-6">
      <div className="pointer-events-none absolute inset-0 opacity-60 blur-xs">
        <StatusSkeletonBackground />
      </div>
      <Card className="border-border/50 bg-background/95 relative z-10 w-full max-w-md backdrop-blur-md">
        <CardContent className="space-y-8 p-8">{children}</CardContent>
      </Card>
    </main>
  )
}

export function StatusIcon({
  children,
  color = "primary",
  animate = false,
}: {
  children: ReactNode
  color?: "primary" | "yellow" | "red"
  animate?: boolean
}) {
  const styles = {
    primary: "bg-primary/10 border-primary/10 text-primary",
    yellow:
      "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:bg-yellow-400/10 dark:border-yellow-400/20 dark:text-yellow-400",
    red: "bg-destructive/10 border-destructive/20 text-destructive",
  }

  return (
    <div className="flex justify-center">
      <div className="relative">
        <div
          className={`absolute inset-0 scale-150 rounded-full blur-xl ${styles[color].split(" ")[0]}`}
        />
        <div
          className={`relative rounded-2xl border p-6 ${animate ? "animate-pulse" : ""} ${styles[color]}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function StatusContent({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-3 text-center">
      <h1 className="text-foreground text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

export function StatusFooter({ children }: { children: ReactNode }) {
  return (
    <div className="border-border/30 border-t pt-4 text-center">
      <p className="text-muted-foreground/80 text-xs">{children}</p>
    </div>
  )
}
