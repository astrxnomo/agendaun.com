"use server"

import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"

import type { Faculties, Programs, Sedes } from "@/types"

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

export async function getProgramsByFaculty(
  facultyId: string,
): Promise<Programs[]> {
  try {
    const data = await db()
    const result = await data.programs.list([
      Query.equal("faculty_id", facultyId),
      Query.orderAsc("name"),
      Query.limit(100),
    ])
    return result.documents as Programs[]
  } catch (error) {
    console.error("Error getting programs by faculty:", error)
    return []
  }
}

export async function getSedeById(sedeId: string): Promise<Sedes | null> {
  try {
    const data = await db()
    const result = await data.sedes.get(sedeId)
    return result as Sedes
  } catch (error) {
    console.error("Error getting sede by id:", error)
    return null
  }
}

export async function getFacultyById(
  facultyId: string,
): Promise<Faculties | null> {
  try {
    const data = await db()
    const result = await data.faculties.get(facultyId)
    return result as Faculties
  } catch (error) {
    console.error("Error getting faculty by id:", error)
    return null
  }
}

export async function getProgramById(
  programId: string,
): Promise<Programs | null> {
  try {
    const data = await db()
    const result = await data.programs.get(programId)
    return result as Programs
  } catch (error) {
    console.error("Error getting program by id:", error)
    return null
  }
}
