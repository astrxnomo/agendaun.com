import { Permission, Role } from "node-appwrite"

import { getUser } from "../appwrite/auth"

export type CalendarType =
  | "personal"
  | "national"
  | "sede"
  | "faculty"
  | "program"

export function getCalendarType(calendarSlug: string): CalendarType {
  if (calendarSlug.startsWith("personal-")) return "personal"
  if (calendarSlug === "national-calendar") return "national"
  if (calendarSlug === "sede-calendar") return "sede"
  if (calendarSlug === "faculty-calendar") return "faculty"
  if (calendarSlug === "program-calendar") return "program"
  return "personal"
}

export async function setPermissions(
  calendarSlug: string | undefined,
): Promise<string[]> {
  if (!calendarSlug) {
    throw new Error("Calendar slug is required to set permissions")
  }

  const user = await getUser()
  if (!user) throw new Error("User not authenticated")

  const calendarType = getCalendarType(calendarSlug)

  const permissions: string[] = []

  switch (calendarType) {
    case "personal":
      permissions.push(
        Permission.read(Role.user(user.$id)),
        Permission.write(Role.user(user.$id)),
      )
      break

    case "national":
      permissions.push(
        Permission.read(Role.users("verified")),
        Permission.write(
          Role.team(
            process.env.NEXT_PUBLIC_TEAMS_EDITORS!,
            "national-calendar",
          ),
        ),
      )
      break

    case "sede":
      permissions.push(
        Permission.read(Role.users("verified")),
        Permission.write(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "sede-calendar"),
        ),
      )
      break

    case "faculty":
      permissions.push(
        Permission.read(Role.users("verified")),
        Permission.write(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "faculty-calendar"),
        ),
      )
      break

    case "program":
      permissions.push(
        Permission.read(Role.users("verified")),
        Permission.write(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "program-calendar"),
        ),
      )
      break
  }

  return permissions
}
