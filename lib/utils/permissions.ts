import { Permission, Role } from "node-appwrite"

import { getUser } from "../appwrite/auth"

export async function setPermissions(
  calendarSlug: string | undefined,
): Promise<string[]> {
  const user = await getUser()
  if (!user) throw new Error("User not authenticated")

  const permissions: string[] = []

  switch (calendarSlug) {
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
