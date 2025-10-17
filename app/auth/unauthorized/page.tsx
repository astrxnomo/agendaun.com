import { Unauthorized } from "@/components/auth/unauthorized"
import { PageHeader } from "@/components/page-header"

export default function UnauthorizedPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Acceso restringido", isCurrentPage: true },
        ]}
      />
      <Unauthorized />
    </>
  )
}
