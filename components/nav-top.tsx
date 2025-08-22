"use client"
import { LogIn } from "lucide-react"
import Link from "next/link"

import { AcademicConfig } from "@/components/academic/nav-button"
import Search from "@/components/search-dialog"
import { useAuthContext } from "@/contexts/auth-context"

import Notifications from "./notifications-button"
import ThemeToggle from "./theme-toggle"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

export default function NavTop() {
  const { user, isLoading } = useAuthContext()

  return (
    <header className="border-b px-4">
      <nav className="flex h-14 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          {user && <AcademicConfig />}
        </div>

        <div className="grow">
          <div className="relative mx-auto w-full max-w-sm">
            <Search />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : user ? (
            <Notifications />
          ) : (
            <Button asChild size="sm" variant="default">
              <Link href="/auth/login">
                <LogIn className="size-4" />
                <span className="hidden md:inline">Iniciar sesión</span>
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
