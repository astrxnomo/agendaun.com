import ConfigFilterButton from "@/components/config-filter-button"
import Search from "@/components/search-dialog"

import Notifications from "./notifications-button"
import ThemeToggle from "./theme-toggle"

export default function NavSearch() {
  return (
    <header className="border-b px-4">
      <div className="flex h-14 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          <ConfigFilterButton />
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

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
