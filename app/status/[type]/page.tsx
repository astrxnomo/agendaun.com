import { StatusMessage } from "@/components/status-message"

type MessageType = "info" | "warning" | "error"

export default async function StatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>
  searchParams: Promise<{
    title?: string
    description?: string
  }>
}) {
  const { type } = await params
  const { title, description } = await searchParams

  return (
    <StatusMessage
      type={type as MessageType}
      title={title}
      description={description}
    />
  )
}
