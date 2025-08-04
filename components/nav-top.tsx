import Notifications from "./notifications-button"
import Search from "./search-dialog"
import { SidebarTrigger } from "./ui/sidebar"

export default function NavSearch() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <SidebarTrigger />
        </div>
        {/* Middle area */}
        <div className="grow">
          {/* Search form */}
          <div className="relative mx-auto w-full max-w-xs">
            <Search />
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Notifications />
        </div>
      </div>
    </header>
  )
}
