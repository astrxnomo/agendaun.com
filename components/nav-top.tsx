import ConfigFilterButton from "@/components/config-filter-button"
import Search from "@/components/search-dialog"

import Notifications from "./notifications-button"
import ThemeToggle from "./theme-toggle"

export default function NavSearch() {
  return (
    <header className="border-b px-4">
      <div className="flex h-14 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <ConfigFilterButton />
        </div>
        <div className="grow">
          <div className="relative mx-auto w-full max-w-sm">
            <Search />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Notifications />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
