# Sistema de Calendarios Múltiples

Este documento explica cómo funciona el nuevo sistema de calendarios que maneja etiquetas únicas por calendario y filtros académicos compartidos.

## Estructura del Sistema

### 1. CalendarContext Actualizado

El contexto ahora maneja:
- **Etiquetas por calendario**: Cada calendario (`personal`, `national`, `sede`, `facultad`, `programa`) tiene sus propias etiquetas independientes
- **Filtros académicos compartidos**: Los filtros de sede, facultad y programa se comparten entre todos los calendarios

```typescript
interface CalendarContextType {
  // Gestión de fechas (compartida)
  currentDate: Date
  setCurrentDate: (date: Date) => void

  // Gestión de etiquetas por calendario
  visibleEtiquettes: Record<CalendarId, string[]>
  toggleEtiquetteVisibility: (calendarId: CalendarId, color: string) => void
  isEtiquetteVisible: (calendarId: CalendarId, color: string | undefined) => boolean
  setCalendarEtiquettes: (calendarId: CalendarId, etiquettes: Etiquette[]) => void

  // Filtros académicos (compartidos)
  academicFilters: AcademicFilters
  setAcademicFilter: (filterType: keyof AcademicFilters, value: string) => void
  clearAcademicFilters: () => void
}
```

### 2. Hook useCalendarManager

Este hook facilita el uso del contexto para un calendario específico:

```typescript
const calendarManager = useCalendarManager("personal")

// Uso:
calendarManager.isEtiquetteVisible(color)
calendarManager.toggleEtiquetteVisibility(color)
calendarManager.setCalendarEtiquettes(etiquettes)
calendarManager.academicFilters
calendarManager.setAcademicFilter("sede", "sede-central")
```

## Implementación en Calendarios

### Ejemplo: Personal Calendar

```typescript
export default function PersonalCalendar({ userRole = "user" }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>(personalEvents)
  const calendarManager = useCalendarManager("personal")
  const permissions = useCalendarPermissions("personal", userRole)

  // Inicializar etiquetas para este calendario
  useEffect(() => {
    calendarManager.setCalendarEtiquettes(personalEtiquettes)
  }, [calendarManager])

  // Filtrar eventos basado en etiquetas visibles
  const visibleEvents = useMemo(() => {
    return events.filter((event) =>
      calendarManager.isEtiquetteVisible(event.color)
    )
  }, [events, calendarManager])

  return (
    <>
      <EtiquettesHeader
        etiquettes={personalEtiquettes}
        isEtiquetteVisible={calendarManager.isEtiquetteVisible}
        toggleEtiquetteVisibility={calendarManager.toggleEtiquetteVisibility}
      />
      <SetupCalendar
        events={visibleEvents}
        // ... otras props
        customEtiquettes={personalEtiquettes}
      />
    </>
  )
}
```

### Ejemplo: Sede Calendar (con filtros académicos)

```typescript
export default function SedeCalendar({ userRole = "user" }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>(sedeEvents)
  const calendarManager = useCalendarManager("sede")
  const permissions = useCalendarPermissions("department", userRole)

  useEffect(() => {
    calendarManager.setCalendarEtiquettes(sedeEtiquettes)
  }, [calendarManager])

  // Filtrar eventos basado en etiquetas Y filtros académicos
  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      // Verificar visibilidad de etiquetas
      if (!calendarManager.isEtiquetteVisible(event.color)) {
        return false
      }

      // Verificar filtros académicos
      const { sede, facultad, programa } = calendarManager.academicFilters

      if (sede && event.sede && event.sede !== sede) return false
      if (facultad && event.facultad && event.facultad !== facultad) return false
      if (programa && event.programa && event.programa !== programa) return false

      return true
    })
  }, [events, calendarManager])

  // ... resto de la implementación
}
```

## Etiquetas por Calendario

Cada calendario debe definir sus propias etiquetas:

```typescript
// personal-calendar.tsx
export const personalEtiquettes: Etiquette[] = [
  { id: "materias", name: "Materias", color: "blue", isActive: true },
  { id: "reuniones", name: "Reuniones", color: "orange", isActive: true },
  { id: "examenes", name: "Exámenes", color: "red", isActive: true },
  // ...
]

// sede-calendar.tsx
export const sedeEtiquettes: Etiquette[] = [
  { id: "administrativo", name: "Administrativo", color: "blue", isActive: true },
  { id: "academico", name: "Académico", color: "green", isActive: true },
  { id: "mantenimiento", name: "Mantenimiento", color: "orange", isActive: true },
  // ...
]
```

## Filtros Académicos Compartidos

Los filtros académicos se configuran una vez y afectan a todos los calendarios que los usen:

```typescript
// ConfigFilterButton actualizado
const { academicFilters, setAcademicFilter } = useCalendarContext()

<Select
  value={academicFilters.sede}
  onValueChange={(value) => setAcademicFilter("sede", value)}
>
  <SelectItem value="sede-central">Sede Central</SelectItem>
  <SelectItem value="sede-norte">Sede Norte</SelectItem>
  // ...
</Select>
```

## Beneficios del Nuevo Sistema

1. **Etiquetas independientes**: Cada calendario puede tener sus propias categorías sin interferir con otros
2. **Filtros académicos globales**: Los filtros de sede/facultad/programa se aplican consistentemente
3. **Escalabilidad**: Fácil agregar nuevos calendarios sin afectar los existentes
4. **Mantenimiento**: Cada calendario maneja su propio estado de etiquetas
5. **Flexibilidad**: Los filtros académicos son opcionales y se pueden aplicar selectivamente

## Próximos Pasos

1. Actualizar todos los calendarios restantes (`nacional`, `facultad`, `programa`)
2. Implementar persistencia de filtros en localStorage
3. Agregar API para sincronizar filtros académicos del usuario
4. Crear tests unitarios para el nuevo sistema
