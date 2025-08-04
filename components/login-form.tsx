import { LogIn } from "lucide-react"
import { useId } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

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
                <LogIn className="size-5" />
              </div>
              <DialogHeader>
                <DialogTitle className="sm:text-center">
                  Acceder a HorarioU
                </DialogTitle>
                <DialogDescription className="sm:text-center">
                  Ingresa con tu correo institucional para acceder a todos los
                  eventos universitarios
                </DialogDescription>
              </DialogHeader>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>Correo institucional</Label>
                <Input
                  id={`${id}-email`}
                  placeholder="estudiante@unal.edu.co"
                  type="email"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Enviar enlace de acceso
              </Button>
            </form>

            <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
              <span className="text-muted-foreground text-xs">O</span>
            </div>

            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continuar con Google
            </Button>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
