export type CalendarType =
  | "personal"
  | "national"
  | "department"
  | "public"
  | "facultad"
export type UserRole = "admin" | "editor" | "moderator" | "user"

export interface CalendarPermissions {
  canEdit: boolean
  canDelete: boolean
  canCreate: boolean
  canView: boolean
  calendarType: CalendarType
}

export interface UserPermissions {
  role: UserRole
  userId: string
  authorizedCalendars: CalendarType[]
}

// Configuración de permisos por tipo de calendario
export const CALENDAR_PERMISSIONS: Record<
  CalendarType,
  Record<UserRole, CalendarPermissions>
> = {
  personal: {
    admin: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "personal",
    },
    editor: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "personal",
    },
    moderator: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "personal",
    },
    user: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "personal",
    },
  },
  national: {
    admin: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "national",
    },
    editor: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "national",
    },
    moderator: {
      canEdit: true,
      canDelete: false,
      canCreate: true,
      canView: true,
      calendarType: "national",
    },
    user: {
      canEdit: false,
      canDelete: false,
      canCreate: false,
      canView: true,
      calendarType: "national",
    },
  },
  department: {
    admin: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "department",
    },
    editor: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "department",
    },
    moderator: {
      canEdit: true,
      canDelete: false,
      canCreate: true,
      canView: true,
      calendarType: "department",
    },
    user: {
      canEdit: false,
      canDelete: false,
      canCreate: false,
      canView: true,
      calendarType: "department",
    },
  },
  public: {
    admin: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "public",
    },
    editor: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "public",
    },
    moderator: {
      canEdit: false,
      canDelete: false,
      canCreate: false,
      canView: true,
      calendarType: "public",
    },
    user: {
      canEdit: false,
      canDelete: false,
      canCreate: false,
      canView: true,
      calendarType: "public",
    },
  },
  facultad: {
    admin: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "facultad",
    },
    editor: {
      canEdit: true,
      canDelete: true,
      canCreate: true,
      canView: true,
      calendarType: "facultad",
    },
    moderator: {
      canEdit: true,
      canDelete: false,
      canCreate: true,
      canView: true,
      calendarType: "facultad",
    },
    user: {
      canEdit: false,
      canDelete: false,
      canCreate: false,
      canView: true,
      calendarType: "facultad",
    },
  },
}

// Hook para obtener permisos del usuario actual
export function useCalendarPermissions(
  calendarType: CalendarType,
  userRole: UserRole = "user",
): CalendarPermissions {
  return CALENDAR_PERMISSIONS[calendarType][userRole]
}

// Función para verificar si un usuario puede realizar una acción específica
export function canUserPerformAction(
  action: "edit" | "delete" | "create" | "view",
  calendarType: CalendarType,
  userRole: UserRole = "user",
): boolean {
  const permissions = CALENDAR_PERMISSIONS[calendarType][userRole]

  switch (action) {
    case "edit":
      return permissions.canEdit
    case "delete":
      return permissions.canDelete
    case "create":
      return permissions.canCreate
    case "view":
      return permissions.canView
    default:
      return false
  }
}
