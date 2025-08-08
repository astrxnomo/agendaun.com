import { LogIn, Mail } from "lucide-react"
import { useId } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function LoginForm() {
  const id = useId()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              tooltip="Iniciar sesión"
            >
              <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <LogIn className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Iniciar sesión</span>
                <span className="text-muted-foreground truncate text-xs">
                  Accede con tu correo
                </span>
              </div>
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col items-center gap-2">
              <div
                className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <Mail className="size-5" />
              </div>
              <DialogHeader>
                <DialogTitle className="sm:text-center">
                  Iniciar sesión
                </DialogTitle>
                <DialogDescription className="sm:text-center">
                  Ingresa con tu correo para acceder
                </DialogDescription>
              </DialogHeader>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>Correo institucional</Label>
                <Input
                  id={`${id}-email`}
                  placeholder="usuario@unal.edu.co"
                  type="email"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Enviar enlace de acceso
              </Button>
              <p className="text-muted-foreground text-center text-sm">
                Enviaremos un enlace de acceso a tu correo institucional, ábrelo
                para iniciar sesión
              </p>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
