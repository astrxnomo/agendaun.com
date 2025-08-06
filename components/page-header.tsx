"use client"

import { Fragment } from "react"

import { NavActions } from "@/components/nav-actions"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[]
}

export function PageHeader({ breadcrumbs }: PageHeaderProps) {
  const currentPage = breadcrumbs.find((item) => item.isCurrentPage)

  return (
    <header className="bg-background sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b px-4">
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
      <div className="ml-auto px-3">
        <NavActions />
      </div>
    </header>
  )
}
