"use server"

import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"

import { handleAppwriteError, type AppwriteError } from "../utils/error-handler"

import type { Faculties, Programs, Sedes } from "@/types"

export async function getSedes(): Promise<Sedes[] | AppwriteError> {
  try {
    const data = await db()
    const result = await data.sedes.listRows([
      Query.orderAsc("name"),
      Query.limit(100),
    ])
    return result.documents as Sedes[]
  } catch (error) {
    console.error("Error getting sedes:", error)
    return handleAppwriteError(error)
  }
}

export async function getFacultiesBySede(
  sedeId: string,
): Promise<Faculties[] | AppwriteError> {
  try {
    const data = await db()
    const result = await data.faculties.listRows([
      Query.equal("sede_id", sedeId),
      Query.orderAsc("name"),
      Query.limit(100),
    ])
    return result.documents as Faculties[]
  } catch (error) {
    console.error("Error getting faculties by sede:", error)
    return handleAppwriteError(error)
  }
}

export async function getProgramsByFaculty(
  facultyId: string,
): Promise<Programs[] | AppwriteError> {
  try {
    const data = await db()
    const result = await data.programs.listRows([
      Query.equal("faculty_id", facultyId),
      Query.orderAsc("name"),
      Query.limit(100),
    ])
    return result.documents as Programs[]
  } catch (error) {
    console.error("Error getting programs by faculty:", error)
    return handleAppwriteError(error)
  }
}

export async function getSedeById(
  sedeId: string,
): Promise<Sedes | AppwriteError | null> {
  try {
    const data = await db()
    const result = await data.sedes.getRow(sedeId)
    return result as Sedes
  } catch (error) {
    console.error("Error getting sede by id:", error)
    return handleAppwriteError(error)
  }
}

export async function getFacultyById(
  facultyId: string,
): Promise<Faculties | AppwriteError | null> {
  try {
    const data = await db()
    const result = await data.faculties.getRow(facultyId)
    return result as Faculties
  } catch (error) {
    console.error("Error getting faculty by id:", error)
    return handleAppwriteError(error)
  }
}

export async function getProgramById(
  programId: string,
): Promise<Programs | AppwriteError | null> {
  try {
    const data = await db()
    const result = await data.programs.getRow(programId)
    return result as Programs
  } catch (error) {
    console.error("Error getting program by id:", error)
    return handleAppwriteError(error)
  }
}
