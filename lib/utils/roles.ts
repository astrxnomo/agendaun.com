"use server"

import { addUserToTeam, getUserTeams } from "@/lib/actions/calendars.actions"
import { getUser } from "@/lib/appwrite/auth"

/**
 * Función de ayuda para el desarrollo - permite asignar roles fácilmente
 * En producción, esto se manejaría a través de un panel de administración
 */
export async function assignUserRole(role: "admin" | "editor") {
  try {
    const user = await getUser()
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const userId = user.$id

    switch (role) {
      case "admin":
        // Los admins tienen acceso completo
        await addUserToTeam(userId, "admins")
        console.log(`Usuario ${user.email} asignado como ADMIN`)
        break
      case "editor":
        // Los editores pueden modificar calendarios específicos
        await addUserToTeam(userId, "editors")
        console.log(`Usuario ${user.email} asignado como EDITOR`)
        break
    }

    return { success: true, message: `Rol ${role} asignado correctamente` }
  } catch (error) {
    console.error("Error asignando rol:", error)
    return { success: false, message: "Error al asignar el rol" }
  }
}

/**
 * Función para verificar el rol actual del usuario
 */
export async function getCurrentUserRole(): Promise<{
  role: "admin" | "editor" | "user"
  teams: string[]
}> {
  try {
    const user = await getUser()
    if (!user) {
      return { role: "user", teams: [] }
    }

    const teams = await getUserTeams(user.$id)

    if (teams.includes("admins")) {
      return { role: "admin", teams }
    } else if (teams.includes("editors")) {
      return { role: "editor", teams }
    } else {
      return { role: "user", teams }
    }
  } catch (error) {
    console.error("Error obteniendo rol del usuario:", error)
    return { role: "user", teams: [] }
  }
}
