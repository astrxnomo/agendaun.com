"use server"

import { Query } from "node-appwrite"

import { db } from "@/lib/appwrite/db"

import { handleAppwriteError, type AppwriteError } from "../utils/error-handler"

import type { Faculties, Programs, Sedes } from "@/types"

// Optimized functions using relationships
export async function getSedesWithFaculties(): Promise<
  Sedes[] | AppwriteError
> {
  try {
    const data = await db()
    const result = await data.sedes.list([
      Query.orderAsc("name"),
      Query.limit(100),
      Query.select(["*", "faculties.name"]),
    ])
    return result.rows as Sedes[]
  } catch (error) {
    console.error("Error getting sedes with faculties:", error)
    return handleAppwriteError(error)
  }
}

export async function getFacultiesWithPrograms(
  sedeId: string,
): Promise<Faculties[] | AppwriteError> {
  try {
    const data = await db()
    const result = await data.faculties.list([
      Query.equal("sede", sedeId),
      Query.orderAsc("name"),
      Query.limit(100),
      Query.select(["*", "programs.name"]),
    ])
    return result.rows as Faculties[]
  } catch (error) {
    console.error("Error getting faculties with programs:", error)
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
    ])
    return result.rows as Programs[]
  } catch (error) {
    console.error("Error getting programs by faculty:", error)
    return handleAppwriteError(error)
  }
}
