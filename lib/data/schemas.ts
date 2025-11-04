import { z } from "zod"

import { Colors, DefaultView } from "@/lib/data/types"

// =============================================================================
// AUTH SCHEMAS
// =============================================================================

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "El usuario es requerido")
    .regex(/^[a-zA-Z0-9._-]+$/, "Usuario inválido"),
})

export const configSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede exceder los 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo debe contener letras")
    .trim(),
  sede: z.string().min(1, "La sede es requerida"),
  faculty: z.string().min(1, "La facultad es requerida"),
  program: z.string().min(1, "El programa es requerido"),
  userId: z.string().min(1, "Usuario no autenticado"),
  profileId: z.string().optional(),
})

// =============================================================================
// CALENDAR SCHEMAS
// =============================================================================

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
  icon: z.string().max(100, "El ícono es muy largo").nullable().optional(),
  description: z
    .string()
    .max(500, "La descripción es muy larga")
    .nullable()
    .optional(),
})

export const calendarEtiquetteSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre es muy largo"),
  color: z.nativeEnum(Colors),
  isActive: z.boolean().default(true),
  calendar: z.string().min(1, "El calendario es requerido"),
})

const calendarEventSchemaRaw = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título es muy largo"),
  description: z
    .string()
    .max(3000, "La descripción es muy larga")
    .optional()
    .nullable(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  all_day: z.boolean().default(false),
  location: z
    .string()
    .max(200, "La ubicación es muy larga")
    .optional()
    .nullable(),
  calendar: z.string().min(1, "El calendario es requerido"),
  etiquette: z.string().optional().nullable(),
  sede: z.string().optional().nullable(),
  faculty: z.string().optional().nullable(),
  program: z.string().optional().nullable(),
  image: z.string().nullable().optional(),
})

export const calendarEventSchema = calendarEventSchemaRaw
  .refine(
    (data) => {
      // Si es todo el día, solo validamos las fechas
      if (data.all_day) {
        return data.end >= data.start
      }
      // Si no es todo el día, validamos fecha y hora completas
      return data.end > data.start
    },
    {
      message:
        "La fecha y hora de fin debe ser después de la fecha y hora de inicio",
      path: ["end"],
    },
  )
  .refine(
    (data) => {
      // Validar que solo se especifique un nivel organizacional a la vez
      const levels = [data.sede, data.faculty, data.program].filter(Boolean)
      return levels.length <= 1
    },
    {
      message:
        "Solo se puede especificar un nivel organizacional por evento (sede, facultad o programa)",
      path: ["program"],
    },
  )
  .refine(
    (data) => {
      // Solo debe haber un nivel organizacional (jerárquico en UI, único en DB)
      // Si hay sede (sin faculty ni program), debe tener sede
      if (data.sede && !data.faculty && !data.program) {
        return true
      }
      // Si hay faculty (sin program), debe tener faculty
      if (data.faculty && !data.program) {
        return true
      }
      // Si hay program, debe tener program
      if (data.program) {
        return true
      }
      return true
    },
    {
      message: "Debe seleccionar un nivel organizacional",
      path: ["sede"],
    },
  )

// =============================================================================
// SCHEDULE SCHEMAS
// =============================================================================

export const scheduleSchema = z
  .object({
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
    sede: z.string().nullable().optional(),
    faculty: z.string().nullable().optional(),
    program: z.string().nullable().optional(),
    category: z.string().min(1, "La categoría es requerida"),
    start_hour: z
      .number()
      .int()
      .min(0, "La hora de inicio debe ser entre 0 y 23")
      .max(23, "La hora de inicio debe ser entre 0 y 23"),
    end_hour: z
      .number()
      .int()
      .min(0, "La hora de fin debe ser entre 0 y 23")
      .max(23, "La hora de fin debe ser entre 0 y 23"),
  })
  .refine(
    (data) => {
      // Validar que solo se especifique un nivel organizacional a la vez
      const levels = [data.sede, data.faculty, data.program].filter(Boolean)
      return levels.length <= 1
    },
    {
      message:
        "Solo se puede especificar un nivel organizacional por horario (sede, facultad o programa)",
      path: ["program"],
    },
  )

export const scheduleCategorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(50, "El slug es muy largo")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug debe contener solo letras minúsculas, números y guiones",
    ),
  icon: z.string().max(100, "El ícono es muy largo").nullable().optional(),
})

export const scheduleEventSchemaRaw = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título es muy largo"),
  description: z
    .string()
    .max(3000, "La descripción es muy larga")
    .optional()
    .nullable(),
  location: z
    .string()
    .max(200, "La ubicación es muy larga")
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
  image: z.string().nullable().optional(),
})

export const scheduleEventSchema = scheduleEventSchemaRaw.refine(
  (data) => {
    const startMinutes = data.start_hour * 60 + data.start_minute
    const endMinutes = data.end_hour * 60 + data.end_minute

    return endMinutes !== startMinutes
  },
  {
    message: "El evento debe tener una duración mayor a 0 minutos",
    path: ["end_hour"],
  },
)

export type LoginInput = z.infer<typeof loginSchema>
export type ConfigInput = z.infer<typeof configSchema>
export type CalendarInput = z.infer<typeof calendarSchema>
export type CalendarEtiquetteInput = z.infer<typeof calendarEtiquetteSchema>
export type CalendarEventInput = z.infer<typeof calendarEventSchema>
export type ScheduleInput = z.infer<typeof scheduleSchema>
export type ScheduleCategoryInput = z.infer<typeof scheduleCategorySchema>
export type ScheduleEventInput = z.infer<typeof scheduleEventSchemaRaw>
