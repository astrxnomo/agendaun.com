import { Calendar } from "lucide-react"
import { useId } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <Dialog>
      <DialogTrigger asChild>
        <Button>Iniciar sesión</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Calendar />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Iniciar sesión</DialogTitle>
            <DialogDescription className="sm:text-center">
              Te enviaremos un enlace al correo para acceder
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
            Enviar enlace mágico
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
  )
}
