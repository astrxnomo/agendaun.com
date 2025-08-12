import { ID } from "appwrite"

import { account } from "./appwrite"

export interface User {
  $id: string
  email: string
  loading?: boolean
}

export class AuthService {
  static async sendMagicLink(email: string) {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`

      await account.createMagicURLToken(ID.unique(), email, redirectUrl)

      return { success: true }
    } catch (error) {
      console.error("Error enviando el enlace:", error)
    }
  }

  // Completar login con Magic Link
  static async completeMagicLogin(userId: string, secret: string) {
    try {
      // Verificar si ya hay una sesión activa antes de crear una nueva
      const existingSession = await this.getSession()
      if (existingSession) {
        console.log("Sesión existente encontrada, usando sesión actual")
        return existingSession
      }

      const session = await account.createSession(userId, secret)

      // Guardar sesión en cookies
      document.cookie = `appwrite-session=${session.secret}; path=/; secure; samesite=strict`

      return session
    } catch (error: any) {
      console.error("Error completing magic login:", error)

      // Si el error es por sesión existente, intentar obtener la sesión actual
      if (error.message?.includes("session") || error.code === 401) {
        try {
          const currentSession = await this.getSession()
          if (currentSession) {
            return currentSession
          }
        } catch (sessionError) {
          console.error("Error getting current session:", sessionError)
        }
      }

      throw new Error(error.message || "Error completando el login")
    }
  }

  // Obtener usuario actual
  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get()
      return {
        $id: user.$id,
        email: user.email,
      }
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  // Verificar si hay sesión activa
  static async getSession() {
    try {
      return await account.getSession("current")
    } catch (error) {
      console.error("Error getting session:", error)
    }
  }

  // Cerrar sesión
  static async logout() {
    try {
      await account.deleteSession("current")
      // Limpiar cookie
      document.cookie =
        "appwrite-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      return { success: true }
    } catch (error: any) {
      console.error("Error logging out:", error)
      throw new Error(error.message || "Error cerrando sesión")
    }
  }
}
