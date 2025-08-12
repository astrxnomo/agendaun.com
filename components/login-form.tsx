"use client"

import { Loader2, LogIn, Mail, MailCheck } from "lucide-react"
import { useId, useState } from "react"
import { toast } from "sonner"

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
import { useAuth } from "@/contexts/auth-context"

import type React from "react"

export function LoginForm() {
  const id = useId()
  const { user, login } = useAuth()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [open, setOpen] = useState(false)

  // Si el usuario ya está autenticado, no mostrar el botón
  if (user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("Por favor ingresa tu correo electrónico")
      return
    }

    // // Validar que sea un correo de unal.edu.co
    // if (!email.endsWith("@unal.edu.co")) {
    //   toast.error("Debes usar tu correo institucional (@unal.edu.co)")
    //   return
    // }

    setIsLoading(true)

    try {
      await login(email)
      setEmailSent(true)
      toast.success("¡Enlace enviado! Revisa tu correo electrónico")
    } catch (error: unknown) {
      console.error("Login error:", error)
      if (error instanceof Error) {
        toast.error(error.message || "Error enviando el enlace de acceso")
      } else {
        toast.error("Error enviando el enlace de acceso")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setEmailSent(false)
    setIsLoading(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setTimeout(resetForm, 200)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={open} onOpenChange={handleOpenChange}>
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
                {emailSent ? (
                  <MailCheck className="size-5" />
                ) : (
                  <Mail className="size-5" />
                )}
              </div>
              <DialogHeader>
                <DialogTitle className="sm:text-center">
                  {emailSent ? "¡Enlace enviado!" : "Iniciar sesión"}
                </DialogTitle>
                <DialogDescription className="sm:text-center">
                  {emailSent
                    ? "Revisa tu correo y haz clic en el enlace para acceder"
                    : "Ingresa con tu correo institucional para acceder"}
                </DialogDescription>
              </DialogHeader>
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-email`}>Correo institucional</Label>
                  <Input
                    id={`${id}-email`}
                    placeholder="usuario@unal.edu.co"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar enlace de acceso"
                  )}
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                  Abre el enlance que te enviaremos para acceder
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-primary/5 rounded-lg border border-green-200 p-4">
                  <p className="text-center text-sm">
                    Se ha enviado un enlace de acceso a <strong>{email}</strong>
                  </p>
                </div>
                <p className="text-muted-foreground text-center text-xs">
                  El enlace expira en una hora
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
