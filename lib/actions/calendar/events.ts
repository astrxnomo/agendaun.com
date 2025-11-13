"use server"

import { ID } from "node-appwrite"

import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { BUCKETS, DATABASE_ID, TABLES } from "@/lib/appwrite/config"
import { calendarEventSchema } from "@/lib/data/schemas"
import { type CalendarEvents, type Calendars } from "@/lib/data/types"
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

    const linksJson = formData.get("links") as string | null
    const links: string[] = linksJson ? JSON.parse(linksJson) : []

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

    // Obtener evento existente desde el formulario si existe
    const eventJson = formData.get("event") as string | null
    const existingEvent: CalendarEvents | null = eventJson
      ? JSON.parse(eventJson)
      : null

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
      links: links,
      ...(eventId ? {} : { created_by: createdBy }), // Solo agregar created_by en creación
    }

    const calendarSlug = (calendar as any).slug

    // Determinar si puede usar admin client para crear/editar
    let canUseAdminClient = false

    if (!existingEvent) {
      // Creación: verificar si puede crear en el calendario
      canUseAdminClient = await canCreateInCalendar(calendar as any)
    } else {
      // Edición: verificar si puede editar este evento específico
      // Crear un evento temporal con el calendario completo para la verificación
      const eventForCheck = {
        ...existingEvent,
        calendar: calendar as unknown as Calendars,
      }

      canUseAdminClient = await canEditCalendarEvent(
        eventForCheck as CalendarEvents,
      )
    }

    // Usar el cliente apropiado según los permisos
    const { database: dbClient } = canUseAdminClient
      ? await createAdminClient()
      : await createSessionClient()

    const permissions = await setCalendarEventPermissions(calendarSlug)
    const eventIdToUse = eventId || ID.unique()

    const result = await dbClient.upsertRow({
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

export async function deleteEvent(event: CalendarEvents): Promise<boolean> {
  try {
    const canDelete = await canEditCalendarEvent(event)

    if (!canDelete) {
      throw new Error("No tienes permisos para eliminar este evento")
    }

    const { database, storage } = canDelete
      ? await createAdminClient()
      : await createSessionClient()

    await database.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TABLES.CALENDAR_EVENTS,
      rowId: event.$id,
    })

    if (event.image) {
      try {
        const fileId = extractImageUrl(event.image)
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
    const canEdit = await canEditCalendarEvent(event)

    if (!canEdit) {
      throw new Error("No tienes permisos para mover este evento")
    }

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
