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
      Query.select([
        "*", // select all sede attributes
        "faculties.*", // select all related faculties
      ]),
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
      Query.equal("sede", sedeId), // Query by relationship field directly
      Query.orderAsc("name"),
      Query.limit(100),
      Query.select([
        "*", // select all faculty attributes
        "sede.*", // select related sede data
        "programs.*", // select all related programs
      ]),
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
      Query.equal("faculty", facultyId), // Query by relationship field directly
      Query.orderAsc("name"),
      Query.limit(100),
      Query.select([
        "*", // select all program attributes
        "faculty.*", // select related faculty data
      ]),
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
    const result = await data.sedes.listRows([
      Query.equal("$id", sedeId),
      Query.select([
        "*", // select all sede attributes
        "faculties.*", // select all related faculties
      ]),
    ])
    return (result.documents[0] as Sedes) || null
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
    const result = await data.faculties.listRows([
      Query.equal("$id", facultyId),
      Query.select([
        "*", // select all faculty attributes
        "sede.*", // select related sede data
        "programs.*", // select all related programs
      ]),
    ])
    return (result.documents[0] as Faculties) || null
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
    const result = await data.programs.listRows([
      Query.equal("$id", programId),
      Query.select([
        "*", // select all program attributes
        "faculty.*", // select related faculty data
      ]),
    ])
    return (result.documents[0] as Programs) || null
  } catch (error) {
    console.error("Error getting program by id:", error)
    return handleAppwriteError(error)
  }
}
