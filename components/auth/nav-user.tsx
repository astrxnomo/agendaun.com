"use client"

import { Ellipsis, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

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
import { deleteSession } from "@/lib/appwrite/auth"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, setUser, profile, setProfile } = useAuthContext()
  const router = useRouter()

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    try {
      await deleteSession()
      setUser(null)
      setProfile(null)
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
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
                  {(user.name || user.email)?.replace(/@unal\.edu\.co$/, "")}
                </span>
                {profile?.sede && (
                  <span className="truncate text-[10px]">
                    {profile?.sede?.name} - {profile?.program?.name}
                  </span>
                )}
              </div>
              <Ellipsis className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="bg-primary text-sidebar-primary-foreground h-8 w-8 rounded">
                    {getInitials(user.name || user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name || user.email}
                  </span>

                  <span className="truncate text-[10px]">
                    {profile?.faculty?.name}
                  </span>
                  <span className="truncate text-[10px]">
                    {profile?.program?.name}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <ConfigDialog>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Settings />
                  Configuración
                </DropdownMenuItem>
              </ConfigDialog>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
