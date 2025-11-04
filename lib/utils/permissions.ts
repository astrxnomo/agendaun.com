import { Permission, Role } from "node-appwrite"

import { getUser } from "../data/users/getUser"

const EDITORS_TEAM = process.env.NEXT_PUBLIC_TEAMS_EDITORS!

export async function setCalendarPermissions(
  calendarSlug: string,
): Promise<string[]> {
  const user = await getUser()
  if (!user) throw new Error("Usuario no autenticado")

  const permissions: string[] = []

  if (calendarSlug.startsWith("personal")) {
    permissions.push(
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
    )
  } else {
    permissions.push(
      Permission.read(Role.users("verified")),
      Permission.write(Role.user(user.$id)),
      Permission.write(Role.team(EDITORS_TEAM, `c-${calendarSlug}-admin`)),
      Permission.update(Role.team(EDITORS_TEAM, `c-${calendarSlug}-editor`)),
    )
  }

  return permissions
}

export async function setCalendarEventPermissions(
  calendarSlug: string,
): Promise<string[]> {
  const user = await getUser()
  if (!user) throw new Error("Usuario no autenticado")

  const permissions: string[] = []

  // Eventos en calendarios personales
  if (calendarSlug.startsWith("personal")) {
    permissions.push(
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
    )
  } else {
    permissions.push(
      Permission.read(Role.users("verified")),
      Permission.write(Role.user(user.$id)),
      Permission.write(Role.team(EDITORS_TEAM, `c-${calendarSlug}-admin`)),
      Permission.write(Role.team(EDITORS_TEAM, `c-${calendarSlug}-editor`)),
    )
  }

  return permissions
}

export async function setEtiquettePermissions(
  calendarSlug: string,
): Promise<string[]> {
  const user = await getUser()
  if (!user) throw new Error("Usuario no autenticado")

  const permissions: string[] = []

  if (calendarSlug.startsWith("personal")) {
    permissions.push(
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
    )
  } else {
    permissions.push(
      Permission.read(Role.users("verified")),
      Permission.write(Role.user(user.$id)),
      Permission.write(Role.team(EDITORS_TEAM, `c-${calendarSlug}-admin`)),
      Permission.write(Role.team(EDITORS_TEAM, `c-${calendarSlug}-editor`)),
    )
  }

  return permissions
}

export async function setSchedulePermissions(
  scheduleId: string,
  categorySlug: string,
): Promise<string[]> {
  const user = await getUser()
  if (!user) throw new Error("Usuario no autenticado")

  return [
    Permission.read(Role.users("verified")),
    Permission.write(Role.user(user.$id)),

    Permission.write(Role.team(EDITORS_TEAM, "s.admin")),
    Permission.write(Role.team(EDITORS_TEAM, `s-${categorySlug}.admin`)),
    Permission.write(Role.team(EDITORS_TEAM, `s-${scheduleId}.admin`)),
  ]
}

export async function setScheduleEventPermissions(
  scheduleId: string,
  categorySlug: string,
): Promise<string[]> {
  const user = await getUser()
  if (!user) throw new Error("Usuario no autenticado")

  return [
    Permission.read(Role.users("verified")),
    Permission.write(Role.user(user.$id)),

    Permission.write(Role.team(EDITORS_TEAM, "s.admin")),
    Permission.write(Role.team(EDITORS_TEAM, `s-${categorySlug}.admin`)),
    Permission.write(Role.team(EDITORS_TEAM, `s-${scheduleId}.admin`)),
  ]
}
