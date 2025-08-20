/**
 * @fileoverview Academic Actions - Database Management
 * @description Acciones para manejo de sedes, facultades y programas académicos
 * @category Server Actions
 */

"use server"

import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"

import type { Faculties, Programs, Sedes } from "@/types"

// ===== SEDES ACTIONS =====

/**
 * Obtiene todas las sedes disponibles
 * @returns Lista de sedes ordenadas por nombre
 */
export async function getSedes(): Promise<Sedes[]> {
  try {
    const data = await db()
    const result = await data.sedes.list([
      Query.orderAsc("name"),
      Query.limit(100),
    ])
    return result.documents as Sedes[]
  } catch (error) {
    console.error("Error getting sedes:", error)
    return []
  }
}

/**
 * Obtiene una sede por su ID
 * @param sedeId - ID de la sede
 * @returns Sede encontrada o null
 */
export async function getSedeById(sedeId: string): Promise<Sedes | null> {
  try {
    const data = await db()
    const sede = await data.sedes.get(sedeId)
    return sede as Sedes
  } catch (error) {
    console.error("Error getting sede by ID:", error)
    return null
  }
}

/**
 * Obtiene una sede por su slug
 * @param slug - Slug de la sede
 * @returns Sede encontrada o null
 */
export async function getSedeBySlug(slug: string): Promise<Sedes | null> {
  try {
    const data = await db()
    const result = await data.sedes.list([Query.equal("slug", slug)])
    return (result.documents[0] as Sedes) || null
  } catch (error) {
    console.error("Error getting sede by slug:", error)
    return null
  }
}

// ===== FACULTADES ACTIONS =====

/**
 * Obtiene todas las facultades disponibles
 * @returns Lista de facultades ordenadas por nombre
 */
export async function getFaculties(): Promise<Faculties[]> {
  try {
    const data = await db()
    const result = await data.faculties.list([
      Query.orderAsc("name"),
      Query.limit(200),
    ])
    return result.documents as Faculties[]
  } catch (error) {
    console.error("Error getting faculties:", error)
    return []
  }
}

/**
 * Obtiene facultades por sede
 * @param sedeId - ID de la sede
 * @returns Lista de facultades de la sede
 */
export async function getFacultiesBySede(sedeId: string): Promise<Faculties[]> {
  try {
    const data = await db()
    const result = await data.faculties.list([
      Query.equal("sede_id", sedeId),
      Query.orderAsc("name"),
      Query.limit(100),
    ])
    return result.documents as Faculties[]
  } catch (error) {
    console.error("Error getting faculties by sede:", error)
    return []
  }
}

/**
 * Obtiene una facultad por su ID
 * @param facultyId - ID de la facultad
 * @returns Facultad encontrada o null
 */
export async function getFacultyById(
  facultyId: string,
): Promise<Faculties | null> {
  try {
    const data = await db()
    const faculty = await data.faculties.get(facultyId)
    return faculty as Faculties
  } catch (error) {
    console.error("Error getting faculty by ID:", error)
    return null
  }
}

/**
 * Obtiene una facultad por su slug
 * @param slug - Slug de la facultad
 * @returns Facultad encontrada o null
 */
export async function getFacultyBySlug(
  slug: string,
): Promise<Faculties | null> {
  try {
    const data = await db()
    const result = await data.faculties.list([Query.equal("slug", slug)])
    return (result.documents[0] as Faculties) || null
  } catch (error) {
    console.error("Error getting faculty by slug:", error)
    return null
  }
}

// ===== PROGRAMAS ACTIONS =====

/**
 * Obtiene todos los programas disponibles
 * @returns Lista de programas ordenados por nombre
 */
export async function getPrograms(): Promise<Programs[]> {
  try {
    const data = await db()
    const result = await data.programs.list([
      Query.orderAsc("name"),
      Query.limit(500),
    ])
    return result.documents as Programs[]
  } catch (error) {
    console.error("Error getting programs:", error)
    return []
  }
}

/**
 * Obtiene programas por facultad
 * @param facultyId - ID de la facultad
 * @returns Lista de programas de la facultad
 */
export async function getProgramsByFaculty(
  facultyId: string,
): Promise<Programs[]> {
  try {
    const data = await db()
    const result = await data.programs.list([
      Query.equal("faculties_id", facultyId),
      Query.orderAsc("name"),
      Query.limit(100),
    ])
    return result.documents as Programs[]
  } catch (error) {
    console.error("Error getting programs by faculty:", error)
    return []
  }
}

/**
 * Obtiene un programa por su ID
 * @param programId - ID del programa
 * @returns Programa encontrado o null
 */
export async function getProgramById(
  programId: string,
): Promise<Programs | null> {
  try {
    const data = await db()
    const program = await data.programs.get(programId)
    return program as Programs
  } catch (error) {
    console.error("Error getting program by ID:", error)
    return null
  }
}

/**
 * Obtiene un programa por su slug
 * @param slug - Slug del programa
 * @returns Programa encontrado o null
 */
export async function getProgramBySlug(slug: string): Promise<Programs | null> {
  try {
    const data = await db()
    const result = await data.programs.list([Query.equal("slug", slug)])
    return (result.documents[0] as Programs) || null
  } catch (error) {
    console.error("Error getting program by slug:", error)
    return null
  }
}

// ===== HIERARCHICAL QUERIES =====

/**
 * Obtiene la estructura académica completa organizada jerárquicamente
 * @returns Estructura con sedes -> facultades -> programas
 */
export async function getAcademicStructure() {
  try {
    const [sedes, faculties, programs] = await Promise.all([
      getSedes(),
      getFaculties(),
      getPrograms(),
    ])

    // Organizar en estructura jerárquica
    const structure: Record<
      string,
      {
        name: string
        slug: string
        facultades: Record<
          string,
          {
            name: string
            slug: string
            programas: Record<
              string,
              {
                name: string
                slug: string
              }
            >
          }
        >
      }
    > = {}

    // Inicializar sedes
    sedes.forEach((sede) => {
      structure[sede.slug] = {
        name: sede.name,
        slug: sede.slug,
        facultades: {},
      }
    })

    // Agregar facultades a sus sedes
    faculties.forEach((faculty) => {
      const sede = sedes.find((s) => s.$id === faculty.sede_id)
      if (sede && structure[sede.slug]) {
        structure[sede.slug].facultades[faculty.slug] = {
          name: faculty.name,
          slug: faculty.slug,
          programas: {},
        }
      }
    })

    // Agregar programas a sus facultades
    programs.forEach((program) => {
      const faculty = faculties.find((f) => f.$id === program.faculties_id)
      const sede = faculty ? sedes.find((s) => s.$id === faculty.sede_id) : null

      if (sede && faculty && structure[sede.slug]?.facultades[faculty.slug]) {
        structure[sede.slug].facultades[faculty.slug].programas[program.slug] =
          {
            name: program.name,
            slug: program.slug,
          }
      }
    })

    return structure
  } catch (error) {
    console.error("Error getting academic structure:", error)
    return {}
  }
}

/**
 * Obtiene los IDs correspondientes a partir de slugs
 * @param sedeSlug - Slug de la sede
 * @param facultySlug - Slug de la facultad (opcional)
 * @param programSlug - Slug del programa (opcional)
 * @returns Objeto con los IDs correspondientes
 */
export async function getAcademicIds(
  sedeSlug?: string,
  facultySlug?: string,
  programSlug?: string,
) {
  try {
    const result: {
      sedeId?: string
      facultyId?: string
      programId?: string
    } = {}

    if (sedeSlug) {
      const sede = await getSedeBySlug(sedeSlug)
      if (sede) {
        result.sedeId = sede.$id

        if (facultySlug) {
          const faculties = await getFacultiesBySede(sede.$id)
          const faculty = faculties.find((f) => f.slug === facultySlug)
          if (faculty) {
            result.facultyId = faculty.$id

            if (programSlug) {
              const programs = await getProgramsByFaculty(faculty.$id)
              const program = programs.find((p) => p.slug === programSlug)
              if (program) {
                result.programId = program.$id
              }
            }
          }
        }
      }
    }

    return result
  } catch (error) {
    console.error("Error getting academic IDs:", error)
    return {}
  }
}
