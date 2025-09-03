"use server"

import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"

import { handleAppwriteError, type AppwriteError } from "../utils/error-handler"

import type { Faculties, Programs, Sedes } from "@/types"

export async function getSedes(): Promise<Sedes[] | AppwriteError> {
  try {
    const data = await db()
    const result = await data.sedes.list([
      Query.orderAsc("name"),
      Query.limit(100),
      Query.select(["*", "faculties.*"]),
    ])
    return result.rows as Sedes[]
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
    const result = await data.faculties.list([
      Query.equal("sede", sedeId),
      Query.orderAsc("name"),
      Query.limit(100),
      Query.select(["*", "sede.*", "programs.*"]),
    ])
    return result.rows as Faculties[]
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
    const result = await data.programs.list([
      Query.equal("faculty", facultyId),
      Query.orderAsc("name"),
      Query.limit(100),
      Query.select(["*", "faculty.*"]),
    ])
    return result.rows as Programs[]
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
    const result = await data.sedes.list([
      Query.equal("$id", sedeId),
      Query.select(["*", "faculties.*"]),
    ])
    return (result.rows[0] as Sedes) || null
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
    const result = await data.faculties.list([
      Query.equal("$id", facultyId),
      Query.select(["*", "sede.*", "programs.*"]),
    ])
    return (result.rows[0] as Faculties) || null
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
    const result = await data.programs.list([
      Query.equal("$id", programId),
      Query.select(["*", "faculty.*"]),
    ])
    return (result.rows[0] as Programs) || null
  } catch (error) {
    console.error("Error getting program by id:", error)
    return handleAppwriteError(error)
  }
}
