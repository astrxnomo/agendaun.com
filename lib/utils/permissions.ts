import { Permission, Role } from "node-appwrite"

import { getUser } from "../data/users/getUser"

export async function setPermissions(
  calendarSlug: string | undefined,
): Promise<string[]> {
  const user = await getUser()

  const permissions: string[] = []

  switch (true) {
    case calendarSlug?.startsWith("personal"):
      permissions.push(
        Permission.read(Role.user(user.$id)),
        Permission.write(Role.user(user.$id)),
      )
      break

    case calendarSlug === "national":
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

    case calendarSlug === "sede":
      permissions.push(
        Permission.read(Role.users("verified")),
        Permission.write(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "sede-calendar"),
        ),
      )
      break

    case calendarSlug === "faculty":
      permissions.push(
        Permission.read(Role.users("verified")),
        Permission.write(
          Role.team(process.env.NEXT_PUBLIC_TEAMS_EDITORS!, "faculty-calendar"),
        ),
      )
      break

    case calendarSlug === "program":
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
