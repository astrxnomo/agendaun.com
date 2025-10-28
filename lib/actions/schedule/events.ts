"use server"

import { revalidatePath } from "next/cache"
import { ID } from "node-appwrite"

import { createSessionClient } from "@/lib/appwrite"
import { DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { scheduleEventSchema } from "@/lib/data/schemas"
import { Colors, type ScheduleEvents } from "@/lib/data/types"

export type EventActionState = {
  success: boolean
  message: string
  errors?: {
    title?: string[]
    description?: string[]
    location?: string[]
    days_of_week?: string[]
    start_hour?: string[]
    start_minute?: string[]
    end_hour?: string[]
    end_minute?: string[]
    color?: string[]
    schedule?: string[]
    _form?: string[]
  }
  data?: ScheduleEvents
}

export async function saveEvent(
  prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      days_of_week: JSON.parse(
        (formData.get("days_of_week") as string) || "[]",
      ) as number[],
      start_hour: parseInt(formData.get("start_hour") as string),
      start_minute: parseInt(formData.get("start_minute") as string),
      end_hour: parseInt(formData.get("end_hour") as string),
      end_minute: parseInt(formData.get("end_minute") as string),
      color: formData.get("color") as Colors,
      schedule: formData.get("schedule") as string,
    }

    const validationResult = scheduleEventSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Error de validación",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const validData = validationResult.data

    const { database } = await createSessionClient()

    const eventId = formData.get("eventId") as string | null

    const eventData = {
      title: validData.title,
      description: validData.description || null,
      location: validData.location || null,
      days_of_week: validData.days_of_week,
      start_hour: validData.start_hour,
      start_minute: validData.start_minute,
      end_hour: validData.end_hour,
      end_minute: validData.end_minute,
      color: validData.color,
      schedule: validData.schedule,
    }

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_EVENTS,
      rowId: eventId || ID.unique(),
      data: eventData,
    })

    revalidatePath(`/schedules/[category]/[slug]`, "page")

    return {
      success: true,
      message: eventId
        ? "Evento actualizado correctamente"
        : "Evento creado correctamente",
      data: result as unknown as ScheduleEvents,
    }
  } catch (error) {
    console.error("Error saving event:", error)
    return {
      success: false,
      message: "Error al guardar el evento",
      errors: {
        _form: [error instanceof Error ? error.message : "Error desconocido"],
      },
    }
  }
}

export async function deleteEvent(eventId: string): Promise<EventActionState> {
  try {
    const { database } = await createSessionClient()

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_EVENTS,
      rowId: eventId,
    })

    revalidatePath(`/schedules/[category]/[slug]`, "page")

    return {
      success: true,
      message: "Evento eliminado correctamente",
    }
  } catch (error) {
    console.error("Error deleting event:", error)
    return {
      success: false,
      message: "Error al eliminar el evento",
      errors: {
        _form: [error instanceof Error ? error.message : "Error desconocido"],
      },
    }
  }
}
