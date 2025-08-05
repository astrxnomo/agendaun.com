"use client"
import { createContext, useContext, useState, type ReactNode } from "react"

// Tipos para la estructura universitaria
export interface Campus {
  id: string
  name: string
  city: string
  code: string // BOG, MED, MAN, etc.
}

export interface Faculty {
  id: string
  name: string
  campusId: string
  code: string
}

export interface StudyProgram {
  id: string
  name: string
  facultyId: string
  level: "undergraduate" | "graduate" | "postgraduate"
  code: string
}

// Datos de ejemplo de la Universidad Nacional
export const CAMPUSES: Campus[] = [
  { id: "bog", name: "Bogotá", city: "Bogotá", code: "BOG" },
  { id: "med", name: "Medellín", city: "Medellín", code: "MED" },
  { id: "man", name: "Manizales", city: "Manizales", code: "MAN" },
  { id: "pal", name: "Palmira", city: "Palmira", code: "PAL" },
  { id: "ori", name: "Orinoquia", city: "Arauca", code: "ORI" },
  { id: "ama", name: "Amazonia", city: "Leticia", code: "AMA" },
  { id: "car", name: "Caribe", city: "San Andrés", code: "CAR" },
  { id: "tum", name: "Tumaco", city: "Tumaco", code: "TUM" },
]

export const FACULTIES: Faculty[] = [
  // Bogotá
  { id: "bog-ing", name: "Ingeniería", campusId: "bog", code: "ING" },
  { id: "bog-med", name: "Medicina", campusId: "bog", code: "MED" },
  { id: "bog-cie", name: "Ciencias", campusId: "bog", code: "CIE" },
  { id: "bog-hum", name: "Ciencias Humanas", campusId: "bog", code: "HUM" },
  { id: "bog-eco", name: "Ciencias Económicas", campusId: "bog", code: "ECO" },
  { id: "bog-der", name: "Derecho", campusId: "bog", code: "DER" },
  { id: "bog-vet", name: "Medicina Veterinaria", campusId: "bog", code: "VET" },
  { id: "bog-agr", name: "Agronomía", campusId: "bog", code: "AGR" },
  { id: "bog-art", name: "Artes", campusId: "bog", code: "ART" },
  { id: "bog-enf", name: "Enfermería", campusId: "bog", code: "ENF" },
  { id: "bog-odo", name: "Odontología", campusId: "bog", code: "ODO" },

  // Medellín
  { id: "med-ing", name: "Ingeniería", campusId: "med", code: "ING" },
  { id: "med-cie", name: "Ciencias", campusId: "med", code: "CIE" },
  { id: "med-agr", name: "Ciencias Agrarias", campusId: "med", code: "AGR" },
  { id: "med-arq", name: "Arquitectura", campusId: "med", code: "ARQ" },
  { id: "med-hum", name: "Ciencias Humanas", campusId: "med", code: "HUM" },
  { id: "med-eco", name: "Ciencias Económicas", campusId: "med", code: "ECO" },

  // Manizales
  {
    id: "man-ing",
    name: "Ingeniería y Arquitectura",
    campusId: "man",
    code: "ING",
  },
  { id: "man-cie", name: "Ciencias Exactas", campusId: "man", code: "CIE" },
  { id: "man-adm", name: "Administración", campusId: "man", code: "ADM" },
]

export const STUDY_PROGRAMS: StudyProgram[] = [
  // Ingeniería Bogotá
  {
    id: "bog-ing-sis",
    name: "Ingeniería de Sistemas",
    facultyId: "bog-ing",
    level: "undergraduate",
    code: "ISIS",
  },
  {
    id: "bog-ing-civ",
    name: "Ingeniería Civil",
    facultyId: "bog-ing",
    level: "undergraduate",
    code: "ICIV",
  },
  {
    id: "bog-ing-ind",
    name: "Ingeniería Industrial",
    facultyId: "bog-ing",
    level: "undergraduate",
    code: "IIND",
  },
  {
    id: "bog-ing-ele",
    name: "Ingeniería Eléctrica",
    facultyId: "bog-ing",
    level: "undergraduate",
    code: "IELE",
  },
  {
    id: "bog-ing-mec",
    name: "Ingeniería Mecánica",
    facultyId: "bog-ing",
    level: "undergraduate",
    code: "IMEC",
  },
  {
    id: "bog-ing-qui",
    name: "Ingeniería Química",
    facultyId: "bog-ing",
    level: "undergraduate",
    code: "IQUI",
  },

  // Ciencias Bogotá
  {
    id: "bog-cie-mat",
    name: "Matemáticas",
    facultyId: "bog-cie",
    level: "undergraduate",
    code: "MAT",
  },
  {
    id: "bog-cie-fis",
    name: "Física",
    facultyId: "bog-cie",
    level: "undergraduate",
    code: "FIS",
  },
  {
    id: "bog-cie-qui",
    name: "Química",
    facultyId: "bog-cie",
    level: "undergraduate",
    code: "QUI",
  },
  {
    id: "bog-cie-bio",
    name: "Biología",
    facultyId: "bog-cie",
    level: "undergraduate",
    code: "BIO",
  },

  // Medicina Bogotá
  {
    id: "bog-med-med",
    name: "Medicina",
    facultyId: "bog-med",
    level: "undergraduate",
    code: "MED",
  },

  // Medellín ejemplos
  {
    id: "med-ing-sis",
    name: "Ingeniería de Sistemas",
    facultyId: "med-ing",
    level: "undergraduate",
    code: "ISIS",
  },
  {
    id: "med-ing-civ",
    name: "Ingeniería Civil",
    facultyId: "med-ing",
    level: "undergraduate",
    code: "ICIV",
  },
]

// Filtros activos
export interface UniversityFilters {
  campusId: string | null
  facultyId: string | null
  studyProgramId: string | null
}

// Context
interface UniversityFilterContextType {
  filters: UniversityFilters
  setFilters: (filters: Partial<UniversityFilters>) => void

  // Helpers
  selectedCampus: Campus | null
  selectedFaculty: Faculty | null
  selectedStudyProgram: StudyProgram | null

  // Filtros derivados
  availableFaculties: Faculty[]
  availableStudyPrograms: StudyProgram[]

  // Reset
  resetFilters: () => void
  resetFromCampus: () => void
  resetFromFaculty: () => void
}

const UniversityFilterContext =
  createContext<UniversityFilterContextType | null>(null)

interface UniversityFilterProviderProps {
  children: ReactNode
  defaultFilters?: Partial<UniversityFilters>
}

export function UniversityFilterProvider({
  children,
  defaultFilters = { campusId: "bog" }, // Bogotá por defecto
}: UniversityFilterProviderProps) {
  const [filters, setFiltersState] = useState<UniversityFilters>({
    campusId: defaultFilters.campusId || null,
    facultyId: defaultFilters.facultyId || null,
    studyProgramId: defaultFilters.studyProgramId || null,
  })

  const setFilters = (newFilters: Partial<UniversityFilters>) => {
    setFiltersState((prev) => {
      const updated = { ...prev, ...newFilters }

      // Auto-validación en cascada
      if (newFilters.campusId !== undefined) {
        // Si cambia campus, resetear facultad y programa
        if (newFilters.campusId !== prev.campusId) {
          updated.facultyId = null
          updated.studyProgramId = null
        }
      }

      if (newFilters.facultyId !== undefined) {
        // Si cambia facultad, resetear programa
        if (newFilters.facultyId !== prev.facultyId) {
          updated.studyProgramId = null
        }
      }

      return updated
    })
  }

  // Computed values
  const selectedCampus = filters.campusId
    ? CAMPUSES.find((c) => c.id === filters.campusId) || null
    : null

  const selectedFaculty = filters.facultyId
    ? FACULTIES.find((f) => f.id === filters.facultyId) || null
    : null

  const selectedStudyProgram = filters.studyProgramId
    ? STUDY_PROGRAMS.find((p) => p.id === filters.studyProgramId) || null
    : null

  const availableFaculties = filters.campusId
    ? FACULTIES.filter((f) => f.campusId === filters.campusId)
    : []

  const availableStudyPrograms = filters.facultyId
    ? STUDY_PROGRAMS.filter((p) => p.facultyId === filters.facultyId)
    : []

  // Reset functions
  const resetFilters = () =>
    setFiltersState({ campusId: "bog", facultyId: null, studyProgramId: null })
  const resetFromCampus = () =>
    setFilters({ facultyId: null, studyProgramId: null })
  const resetFromFaculty = () => setFilters({ studyProgramId: null })

  const value: UniversityFilterContextType = {
    filters,
    setFilters,
    selectedCampus,
    selectedFaculty,
    selectedStudyProgram,
    availableFaculties,
    availableStudyPrograms,
    resetFilters,
    resetFromCampus,
    resetFromFaculty,
  }

  return (
    <UniversityFilterContext.Provider value={value}>
      {children}
    </UniversityFilterContext.Provider>
  )
}

export function useUniversityFilters() {
  const context = useContext(UniversityFilterContext)
  if (!context) {
    throw new Error(
      "useUniversityFilters must be used within UniversityFilterProvider",
    )
  }
  return context
}

// Helpers para generar códigos completos
export function generateEventCode(
  campusCode: string,
  facultyCode: string,
  programCode?: string,
  eventType?: string,
): string {
  const parts = [campusCode, facultyCode]
  if (programCode) parts.push(programCode)
  if (eventType) parts.push(eventType)
  return parts.join("-")
}

// Helper para filtrar eventos por contexto universitario
export function filterEventsByUniversityContext<
  T extends { metadata?: Record<string, unknown> },
>(events: T[], filters: UniversityFilters): T[] {
  return events.filter((event) => {
    const metadata = event.metadata
    if (!metadata) return true // Si no tiene metadata, mostrar siempre

    // Filtrar por campus
    if (filters.campusId && metadata.campusId !== filters.campusId) {
      return false
    }

    // Filtrar por facultad
    if (filters.facultyId && metadata.facultyId !== filters.facultyId) {
      return false
    }

    // Filtrar por programa de estudio
    if (
      filters.studyProgramId &&
      metadata.studyProgramId !== filters.studyProgramId
    ) {
      return false
    }

    return true
  })
}
