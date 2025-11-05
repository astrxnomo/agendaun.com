"use server"

import { ID } from "node-appwrite"

import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { BUCKETS, DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { calendarEventSchema } from "@/lib/data/schemas"
import { type CalendarEvents } from "@/lib/data/types"
import { buildImageUrl, extractImageUrl } from "@/lib/utils"
import { handleError } from "@/lib/utils/error-handler"
import { setCalendarEventPermissions } from "@/lib/utils/permissions"
import { canCreateInCalendar, canEditCalendarEvent } from "../users"

export type CalendarEventActionState = {
  success: boolean
  message: string
  errors?: {
    title?: string[]
    description?: string[]
    start?: string[]
    end?: string[]
    all_day?: string[]
    location?: string[]
    calendar?: string[]
    etiquette?: string[]
    image?: string[]
    _form?: string[]
  }
  data?: CalendarEvents
}

export async function saveCalendarEvent(
  prevState: CalendarEventActionState,
  formData: FormData,
): Promise<CalendarEventActionState> {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      start: new Date(formData.get("start") as string),
      end: new Date(formData.get("end") as string),
      all_day: formData.get("all_day") === "true",
      location: formData.get("location") as string,
      calendar: formData.get("calendar") as string,
      etiquette: (formData.get("etiquette") as string) || null,
      sede: (formData.get("sede") as string) || null,
      faculty: (formData.get("faculty") as string) || null,
      program: (formData.get("program") as string) || null,
    }

    const imageFile = formData.get("image") as File | null
    const currentImageId =
      (formData.get("currentImageId") as string | null) || null
    const previousImageId =
      (formData.get("previousImageId") as string | null) || null

    const validationResult = calendarEventSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Error de validación",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const validData = validationResult.data

    const { storage, database } = await createAdminClient()

    let uploadedImageUrl: string | null = null

    if (imageFile && imageFile.size > 0) {
      try {
        if (previousImageId) {
          try {
            const imageId = extractImageUrl(previousImageId)
            if (imageId) {
              await storage.deleteFile({
                bucketId: BUCKETS.CALENDAR_EVENTS_IMAGES,
                fileId: imageId || "",
              })
            }
          } catch (error) {
            console.error("Error deleting old image:", error)
          }
        }

        const uploadedFile = await storage.createFile({
          bucketId: BUCKETS.CALENDAR_EVENTS_IMAGES,
          fileId: ID.unique(),
          file: imageFile,
        })

        uploadedImageUrl = buildImageUrl(
          BUCKETS.CALENDAR_EVENTS_IMAGES,
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
              bucketId: BUCKETS.CALENDAR_EVENTS_IMAGES,
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
    const createdBy = formData.get("created_by") as string | null

    const calendar = await database.getRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDARS,
      rowId: validData.calendar,
    })

    const eventData = {
      title: validData.title,
      description: validData.description || null,
      start: validData.start,
      end: validData.end,
      all_day: validData.all_day,
      location: validData.location || null,
      calendar: validData.calendar,
      etiquette: validData.etiquette || null,
      sede: validData.sede || null,
      faculty: validData.faculty || null,
      program: validData.program || null,
      image: uploadedImageUrl,
      ...(eventId ? {} : { created_by: createdBy }), // Solo agregar created_by en creación
    }

    const calendarSlug = (calendar as any).slug

    // Determinar si es creación o edición
    const isCreating = !eventId
    let canUseAdminClient = false

    if (isCreating) {
      canUseAdminClient = await canCreateInCalendar(calendar as any)
    } else {
      // Para edición, necesitamos obtener el evento existente para verificar quién lo creó
      const existingEvent = await database.getRow({
        databaseId: DATABASE_ID,
        tableId: TABLES.CALENDAR_EVENTS,
        rowId: eventId,
      })
      canUseAdminClient = await canEditCalendarEvent(
        calendar as any,
        (existingEvent as any).created_by?.$id ||
          (existingEvent as any).created_by,
      )
    }

    const { database: adminDatabase } = canUseAdminClient
      ? await createAdminClient()
      : await createSessionClient()

    const permissions = await setCalendarEventPermissions(calendarSlug)

    const eventIdToUse = eventId || ID.unique()

    const result = await adminDatabase.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDAR_EVENTS,
      rowId: eventIdToUse,
      data: eventData,
      permissions: permissions,
    })

    return {
      success: true,
      message: eventId
        ? "Evento actualizado correctamente"
        : "Evento creado correctamente",
      data: result as unknown as CalendarEvents,
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

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const { database, storage } = await createSessionClient()

    let eventImage: string | null = null
    try {
      const existingEvent = await database.getRow({
        databaseId: DATABASE_ID,
        tableId: TABLES.CALENDAR_EVENTS,
        rowId: eventId,
      })
      eventImage = (existingEvent as unknown as CalendarEvents).image
    } catch (error) {}

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDAR_EVENTS,
      rowId: eventId,
    })

    if (eventImage) {
      try {
        const fileId = extractImageUrl(eventImage)
        if (fileId) {
          await storage.deleteFile({
            bucketId: BUCKETS.CALENDAR_EVENTS_IMAGES,
            fileId: fileId,
          })
        }
      } catch (error) {
        console.error("Error deleting event image:", error)
      }
    }

    return true
  } catch (error) {
    handleError(error)
  }
}

export async function moveEvent(
  event: CalendarEvents,
): Promise<CalendarEvents> {
  try {
    // Obtener el calendario completo
    const { database: tempDatabase } = await createAdminClient()
    const calendar = await tempDatabase.getRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDARS,
      rowId: (event.calendar as any).$id || event.calendar,
    })

    // Verificar si puede editar este evento específico (considerando si es creador)
    const canEdit = await canEditCalendarEvent(
      calendar as any,
      (event as any).created_by?.$id || (event as any).created_by,
    )
    const { database } = canEdit
      ? await createAdminClient()
      : await createSessionClient()

    const result = await database.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDAR_EVENTS,
      rowId: event.$id,
      data: event,
    })
    return result as unknown as CalendarEvents
  } catch (error) {
    handleError(error)
  }
}
