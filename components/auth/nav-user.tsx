"use client"

import { Ellipsis, LogOut, SquareUser } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { ConfigDialog } from "@/components/auth/config-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuthContext } from "@/contexts/auth-context"
import { logout } from "@/lib/appwrite/auth"
import { formatUserName, getInitials } from "@/lib/utils"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, refreshAuth, profile } = useAuthContext()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      await logout()
      await refreshAuth()
      toast.success("Sesión cerrada exitosamente")
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
      toast.error("Error", {
        description: "No se pudo cerrar la sesión. Intenta de nuevo.",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded">
                <AvatarFallback className="bg-primary text-sidebar-primary-foreground h-8 w-8 rounded">
                  {getInitials(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {formatUserName(user.name, user.email)}
                </span>
                {profile?.sede && profile?.program && (
                  <span className="text-muted-foreground truncate text-[10px]">
                    {profile.sede.name} - {profile.program.name}
                  </span>
                )}
              </div>
              <Ellipsis className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded"
            side={isMobile ? "bottom" : "right"}
            align="end"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="bg-primary text-sidebar-primary-foreground h-8 w-8 rounded">
                    {getInitials(user.name || user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-sidebar-primary-foreground truncate font-medium">
                    {user.name || user.email}
                  </span>
                  {profile?.sede && (
                    <span className="text-muted-foreground truncate text-[10px]">
                      {profile.sede.name}
                    </span>
                  )}
                  {profile?.faculty && (
                    <span className="text-muted-foreground truncate text-[10px]">
                      {profile.faculty.name}
                    </span>
                  )}
                  {profile?.program && (
                    <span className="text-muted-foreground truncate text-[10px]">
                      {profile.program.name}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuGroup>
              <ConfigDialog>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <SquareUser />
                  Mi cuenta
                </DropdownMenuItem>
              </ConfigDialog>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut />
              {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
