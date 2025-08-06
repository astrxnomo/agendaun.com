import { type EventColor } from "./types"

// Definición centralizada simplificada de colores del calendario
// Paleta optimizada para máxima diferenciación visual
export const calendarColors: {
  value: EventColor
  label: string
  shade: number
}[] = [
  { value: "gray", label: "Sin color", shade: 400 }, // Color para eventos sin etiqueta
  { value: "blue", label: "Azul", shade: 200 }, // Azul clásico
  { value: "red", label: "Rojo", shade: 200 }, // Rojo vibrante
  { value: "green", label: "Verde", shade: 200 }, // Verde natural
  { value: "purple", label: "Morado", shade: 200 }, // Morado distintivo
  { value: "orange", label: "Naranja", shade: 200 }, // Naranja brillante
  { value: "pink", label: "Rosa", shade: 200 }, // Rosa vibrante
  { value: "teal", label: "Verde azulado", shade: 200 }, // Teal distintivo
  { value: "yellow", label: "Amarillo", shade: 200 }, // Amarillo brillante
  { value: "indigo", label: "Añil", shade: 200 }, // Indigo profundo
]

// Genera las clases CSS dinámicamente basado en el color y shade
const generateColorClasses = (color: EventColor, shade: number) => {
  return {
    // Clases básicas para badges/dialogs con colores más suaves
    bgClass: `bg-${color}-100 dark:bg-${color}-900/30`,
    textClass: `text-${color}-700 dark:text-${color}-300`,
    borderClass: `border-${color}-200 dark:border-${color}-700`,

    // Clases sólidas para indicadores (círculos)
    solidBgClass: `bg-${color}-500`,
    solidBorderClass: `border-${color}-600`,

    // Clases optimizadas para eventos con transparencias
    eventClasses: `bg-${color}-${shade}/50 hover:bg-${color}-${shade}/40 text-${color}-900/90 shadow-${color}-700/8 dark:bg-${color}-400/25 dark:hover:bg-${color}-400/20 dark:text-${color}-200`,
  }
}

// Función para obtener las clases de color completas para badges/elementos
export const getColorClasses = (color: EventColor) => {
  const colorConfig = calendarColors.find((c) => c.value === color)
  if (!colorConfig) {
    // Fallback al gris si no se encuentra el color
    return generateColorClasses("gray", 400)
  }
  return generateColorClasses(colorConfig.value, colorConfig.shade)
}

// Función para obtener el nombre de la etiqueta basado en el color
export const getColorLabel = (color: EventColor): string => {
  const colorConfig = calendarColors.find((c) => c.value === color)
  return colorConfig ? colorConfig.label : "Sin categoría"
}

// Función para obtener la etiqueta del evento (prioriza event.label, luego color)
export const getEventLabel = (event: {
  label?: string
  color?: EventColor
}): string => {
  // Si el evento tiene una etiqueta personalizada, usarla
  if (event.label) {
    return event.label
  }

  // Si no, usar la etiqueta basada en el color
  if (event.color) {
    return getColorLabel(event.color)
  }

  // Fallback
  return "Evento"
}

// Función para obtener las clases CSS de badge/dialog
export const getColorClass = (color: EventColor) => {
  const colorClasses = generateColorClasses(color, 200)
  return `${colorClasses.bgClass} ${colorClasses.textClass} ${colorClasses.borderClass}`
}

// Función para obtener las clases CSS para el indicador circular
export const getCircleColorClass = (color: EventColor) => {
  return `bg-${color}-500 border-${color}-600 border`
}

// Función para obtener las clases CSS para eventos con transparencias y modo oscuro
export const getEventColorClasses = (color: EventColor) => {
  const colorConfig = calendarColors.find((c) => c.value === color)
  if (!colorConfig) {
    // Fallback al gris si no se encuentra el color
    return generateColorClasses("gray", 400).eventClasses
  }
  // Usar el shade configurado para cada color
  return generateColorClasses(colorConfig.value, colorConfig.shade).eventClasses
}

// Función para obtener las clases CSS para etiquetas/badges activos
export const getLabelColorClasses = (color: EventColor) => {
  const colorClasses = generateColorClasses(color, 200)
  return {
    activeClasses: `${colorClasses.solidBgClass} text-white hover:bg-${color}-700`,
    eventStyleClasses: colorClasses.eventClasses,
  }
}
