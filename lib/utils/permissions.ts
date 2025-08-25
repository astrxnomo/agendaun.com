import { Permission, Role } from "node-appwrite"

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
  calendarSlug: string,
  userId: string,
): Promise<string[]> {
  const calendarType = getCalendarType(calendarSlug)

  const permissions: string[] = []

  switch (calendarType) {
    case "personal":
      permissions.push(
        Permission.read(Role.user(userId)),
        Permission.create(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      )
      break

    case "national":
      permissions.push(
        Permission.create(
          Role.team(
            process.env.NEXT_PUBLIC_TEAMS_EDITORS!,
            "national-calendar",
          ),
        ),
        Permission.update(
          Role.team(
            process.env.NEXT_PUBLIC_TEAMS_EDITORS!,
            "national-calendar",
          ),
        ),
        Permission.delete(
          Role.team(
            process.env.NEXT_PUBLIC_TEAMS_EDITORS!,
            "national-calendar",
          ),
        ),
      )
      break

    case "sede":
      permissions.push(
        Permission.create(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "sede-calendar"),
        ),
        Permission.update(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "sede-calendar"),
        ),
        Permission.delete(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "sede-calendar"),
        ),
      )
      break

    case "faculty":
      permissions.push(
        Permission.create(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "faculty-calendar"),
        ),
        Permission.update(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "faculty-calendar"),
        ),
        Permission.delete(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "faculty-calendar"),
        ),
      )
      break

    case "program":
      permissions.push(
        Permission.create(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "program-calendar"),
        ),
        Permission.update(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "program-calendar"),
        ),
        Permission.delete(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "program-calendar"),
        ),
      )
      break
  }

  return permissions
}
