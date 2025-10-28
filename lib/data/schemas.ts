import { z } from "zod"

import { Colors, DefaultView } from "@/lib/data/types"

/**
 * Schema para validación de eventos de calendario
 */
export const calendarEventSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título es muy largo"),
  description: z
    .string()
    .max(1000, "La descripción es muy larga")
    .optional()
    .nullable(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  all_day: z.boolean().default(false),
  location: z
    .string()
    .max(100, "La ubicación es muy larga")
    .optional()
    .nullable(),
  calendar: z.string().min(1, "El calendario es requerido"),
  etiquette: z.string().optional().nullable(),
  sede: z.string().optional().nullable(),
  faculty: z.string().optional().nullable(),
  program: z.string().optional().nullable(),
})

/**
 * Schema para validación de eventos de horario
 */
export const scheduleEventSchemaRaw = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título es muy largo"),
  description: z
    .string()
    .max(500, "La descripción es muy larga")
    .optional()
    .nullable(),
  location: z
    .string()
    .max(100, "La ubicación es muy larga")
    .optional()
    .nullable(),
  days_of_week: z
    .array(z.number().min(1, "Día inválido").max(7, "Día inválido"))
    .min(1, "Debe seleccionar al menos un día")
    .max(7, "Máximo 7 días"),
  start_hour: z.number().min(0, "Hora inválida").max(23, "Hora inválida"),
  start_minute: z.number().min(0, "Minuto inválido").max(59, "Minuto inválido"),
  end_hour: z.number().min(0, "Hora inválida").max(23, "Hora inválida"),
  end_minute: z.number().min(0, "Minuto inválido").max(59, "Minuto inválido"),
  color: z.nativeEnum(Colors),
  schedule: z.string().min(1, "El horario es requerido"),
})

/**
 * Refinamiento para validar que la hora de fin sea después de la hora de inicio
 */
export const scheduleEventSchema = scheduleEventSchemaRaw.refine(
  (data) => {
    const startMinutes = data.start_hour * 60 + data.start_minute
    const endMinutes = data.end_hour * 60 + data.end_minute
    return endMinutes > startMinutes
  },
  {
    message: "La hora de fin debe ser después de la hora de inicio",
    path: ["end_hour"],
  },
)

/**
 * Schema para validación de etiquetas de calendario
 */
export const calendarEtiquetteSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre es muy largo"),
  color: z.nativeEnum(Colors),
  isActive: z.boolean().default(true),
  calendar: z.string().min(1, "El calendario es requerido"),
})

/**
 * Schema para validación de calendarios
 */
export const calendarSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo")
    .nullable()
    .optional(),
  defaultView: z.nativeEnum(DefaultView),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(50, "El slug es muy largo")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug debe contener solo letras minúsculas, números y guiones",
    ),
  profile: z.string().nullable().optional(),
  requireConfig: z.boolean().default(false),
  icon: z.string().nullable().optional(),
})

/**
 * Schema para validación de horarios
 */
export const scheduleSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo")
    .nullable()
    .optional(),
  description: z
    .string()
    .max(500, "La descripción es muy larga")
    .nullable()
    .optional(),
  sede: z.string().min(1, "La sede es requerida"),
  faculty: z.string().nullable().optional(),
  program: z.string().nullable().optional(),
  category: z.string().min(1, "La categoría es requerida"),
})

/**
 * Schema para validación de categorías de horarios
 */
export const scheduleCategorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre es muy largo"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(50, "El slug es muy largo")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug debe contener solo letras minúsculas, números y guiones",
    ),
  icon: z.string().nullable().optional(),
})

/**
 * Schema para validación de perfiles
 */
export const profileSchema = z.object({
  user_id: z.string().min(1, "El ID de usuario es requerido"),
  sede: z.string().min(1, "La sede es requerida"),
  faculty: z.string().min(1, "La facultad es requerida"),
  program: z.string().min(1, "El programa es requerido"),
})

/**
 * Schema para validación de sedes
 */
export const sedeSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo"),
})

/**
 * Schema para validación de facultades
 */
export const facultySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo"),
  sede: z.string().min(1, "La sede es requerida"),
})

/**
 * Schema para validación de programas
 */
export const programSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo"),
  faculty: z.string().min(1, "La facultad es requerida"),
})

export type CalendarEventInput = z.infer<typeof calendarEventSchema>
export type ScheduleEventInput = z.infer<typeof scheduleEventSchemaRaw>
export type CalendarEtiquetteInput = z.infer<typeof calendarEtiquetteSchema>
export type CalendarInput = z.infer<typeof calendarSchema>
export type ScheduleInput = z.infer<typeof scheduleSchema>
export type ScheduleCategoryInput = z.infer<typeof scheduleCategorySchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type SedeInput = z.infer<typeof sedeSchema>
export type FacultyInput = z.infer<typeof facultySchema>
export type ProgramInput = z.infer<typeof programSchema>
