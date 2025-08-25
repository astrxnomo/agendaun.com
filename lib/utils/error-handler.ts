import { AppwriteException } from "node-appwrite"

export interface AppwriteError {
  message: string
  type: string
  code: number
}
export function isAppwriteError(result: unknown): result is AppwriteError {
  return (
    typeof result === "object" &&
    result !== null &&
    "type" in result &&
    "message" in result
  )
}

export function handleAppwriteError(error: unknown): AppwriteError {
  if (error instanceof AppwriteException) {
    return {
      message: error.message || "Error desconocido",
      type: error.type || "unknown_error",
      code: error.code || 500,
    }
  }

  return {
    message: error instanceof Error ? error.message : "Error desconocido",
    type: "unknown_error",
    code: 500,
  }
}
