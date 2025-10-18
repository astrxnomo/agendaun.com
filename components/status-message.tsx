import { Info, ShieldBan, TriangleAlert } from "lucide-react"

import {
  StatusCard,
  StatusContent,
  StatusFooter,
  StatusIcon,
} from "./ui/status-card"

import type { ReactNode } from "react"

type MessageType = "info" | "warning" | "error"

const config = {
  info: {
    icon: Info,
    color: "primary" as const,
    animate: true,
    title: "Información",
    description: "Mensaje informativo",
  },
  warning: {
    icon: TriangleAlert,
    color: "yellow" as const,
    animate: true,
    title: "Atención",
    description: "Se requiere tu atención",
  },
  error: {
    icon: ShieldBan,
    color: "red" as const,
    animate: false,
    title: "Error",
    description: "Ha ocurrido un error",
  },
}

export function StatusMessage({
  type,
  title,
  description,
  footer,
  button,
}: {
  type: MessageType
  title?: string
  description?: string
  footer?: string
  button?: ReactNode
}) {
  const {
    icon: Icon,
    color,
    animate,
    title: defaultTitle,
    description: defaultDesc,
  } = config[type]

  return (
    <StatusCard>
      <StatusIcon color={color} animate={animate}>
        <Icon className="size-8" />
      </StatusIcon>

      <StatusContent
        title={title || defaultTitle}
        description={description || defaultDesc}
      />

      {button}

      {footer && <StatusFooter>{footer}</StatusFooter>}
    </StatusCard>
  )
}
