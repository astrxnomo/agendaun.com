"use server"

import { revalidatePath } from "next/cache"
import { ID } from "node-appwrite"

import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { BUCKETS, DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { scheduleEventSchema } from "@/lib/data/schemas"
import { Colors, type ScheduleEvents } from "@/lib/data/types"
import { buildImageUrl, extractImageUrl } from "@/lib/utils"
import { setScheduleEventPermissions } from "@/lib/utils/permissions"
import { canAdminSchedule } from "../users"

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
    image?: string[]
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

    const imageFile = formData.get("image") as File | null
    const currentImageId =
      (formData.get("currentImageId") as string | null) || null
    const previousImageId =
      (formData.get("previousImageId") as string | null) || null

    const validationResult = scheduleEventSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Error de validación",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const validData = validationResult.data

    const { storage } = await createAdminClient()

    let uploadedImageUrl: string | null = null

    if (imageFile && imageFile.size > 0) {
      try {
        if (previousImageId) {
          try {
            const imageId = extractImageUrl(previousImageId)
            if (imageId) {
              await storage.deleteFile({
                bucketId: BUCKETS.SCHEDULE_EVENTS_IMAGES,
                fileId: imageId || "",
              })
            }
          } catch (error) {
            console.error("Error deleting old image:", error)
          }
        }

        const uploadedFile = await storage.createFile({
          bucketId: BUCKETS.SCHEDULE_EVENTS_IMAGES,
          fileId: ID.unique(),
          file: imageFile,
        })

        uploadedImageUrl = buildImageUrl(
          BUCKETS.SCHEDULE_EVENTS_IMAGES,
          uploadedFile.$id,
        )
      } catch (error) {
        console.error("Error uploading image:", error)
        return {
          success: false,
          message: "Error al subir la imagen",
          errors: {
            image: [
              error instanceof Error
                ? error.message
                : "Error al subir la imagen",
            ],
          },
        }
      }
    } else if (!imageFile) {
      if (!currentImageId && previousImageId) {
        try {
          const imageId = extractImageUrl(previousImageId)
          if (imageId) {
            await storage.deleteFile({
              bucketId: BUCKETS.SCHEDULE_EVENTS_IMAGES,
              fileId: imageId || "",
            })
          }
        } catch (error) {
          console.error("Error deleting removed image:", error)
        }
        uploadedImageUrl = null
      } else {
        uploadedImageUrl = currentImageId
      }
    }

    const eventId = formData.get("eventId") as string | null
    const scheduleCategorySlug =
      (formData.get("scheduleCategorySlug") as string) || ""

    // Obtener el schedule completo para verificar permisos
    const { database: tempDatabase } = await createAdminClient()
    const schedule = await tempDatabase.getRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULES,
      rowId: validData.schedule,
    })

    // Usar el cliente apropiado basado en permisos
    const { database } = (await canAdminSchedule(schedule as any))
      ? await createAdminClient()
      : await createSessionClient()

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
      image: uploadedImageUrl,
    }

    const eventIdToUse = eventId || ID.unique()

    const permissions = await setScheduleEventPermissions(
      eventIdToUse,
      scheduleCategorySlug,
    )

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_EVENTS,
      rowId: eventIdToUse,
      data: eventData,
      permissions: permissions,
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
    const { database, storage } = await createSessionClient()

    let eventImage: string | null = null
    try {
      const existingEvent = await database.getRow({
        databaseId: DATABASE_ID,
        tableId: TABLES.SCHEDULE_EVENTS,
        rowId: eventId,
      })
      eventImage = (existingEvent as unknown as ScheduleEvents).image
    } catch (error) {}

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.SCHEDULE_EVENTS,
      rowId: eventId,
    })

    if (eventImage) {
      try {
        const fileId = extractImageUrl(eventImage)
        if (fileId) {
          await storage.deleteFile({
            bucketId: BUCKETS.SCHEDULE_EVENTS_IMAGES,
            fileId: fileId,
          })
        }
      } catch (error) {
        console.error("Error deleting event image:", error)
      }
    }

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
