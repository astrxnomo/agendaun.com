"use server"

import { revalidatePath } from "next/cache"

import { createAdminClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { configSchema } from "@/lib/data/schemas"

export type ProfileConfigState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    sede?: string[]
    faculty?: string[]
    program?: string[]
    userId?: string[]
    _form?: string[]
  }
}

export async function saveProfileConfig(
  prevState: ProfileConfigState,
  formData: FormData,
): Promise<ProfileConfigState> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      sede: formData.get("sede") as string,
      faculty: formData.get("faculty") as string,
      program: formData.get("program") as string,
      userId: formData.get("userId") as string,
      profileId: formData.get("profileId") as string,
    }

    const validationResult = configSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Error de validación",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const validData = validationResult.data

    const { database, users } = await createAdminClient()

    const currentUserName = formData.get("currentUserName") as string
    if (validData.name !== currentUserName) {
      await users.updateName(validData.userId, validData.name.trim())
    }

    const configData = {
      $id: validData.profileId || "",
      user_id: validData.userId,
      sede: { $id: validData.sede },
      faculty: { $id: validData.faculty },
      program: { $id: validData.program },
    }

    await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.PROFILES,
      rowId: configData.$id,
      data: configData,
    })

    revalidatePath("/", "layout")

    return {
      success: true,
      message: "Configuración guardada correctamente",
    }
  } catch (error) {
    console.error("Error saving user config:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al guardar la configuración",
      errors: {
        _form: [error instanceof Error ? error.message : "Error desconocido"],
      },
    }
  }
}
