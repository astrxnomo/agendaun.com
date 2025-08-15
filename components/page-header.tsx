import { Fragment, type ReactNode } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[]
  action?: ReactNode
}

export function PageHeader({ breadcrumbs, action }: PageHeaderProps) {
  const currentPage = breadcrumbs.find((item) => item.isCurrentPage)

  return (
    <header className="bg-background sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />

      <Breadcrumb>
        <BreadcrumbList>
          {/* Mobile: solo página actual */}
          <BreadcrumbItem className="md:hidden">
            {currentPage && (
              <BreadcrumbPage>{currentPage.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>

          {/* Desktop: breadcrumbs completos */}
          {breadcrumbs.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem className="hidden md:block">
                {item.isCurrentPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href || "#"}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex gap-4">
        {/* <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="inline size-3" />
          Actualizado Oct 08
        </div> */}
        {action && <>{action}</>}
      </div>
    </header>
  )
}
