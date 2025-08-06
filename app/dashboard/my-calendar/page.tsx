import MyCalendar from "@/components/calendars/my-calendar"
import { NavActions } from "@/components/nav-actions"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function Page() {
  return (
    <>
      <header className="bg-background sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                Mi Calendario
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto px-3">
          <NavActions />
        </div>
      </header>
      <MyCalendar editable={true} />
    </>
  )
}
