"use client";

import { Menu } from "lucide-react";
import { useLayoutStore, type UserRole } from "@/stores";
import { Breadcrumb, Search, Select } from "@/shared/components";
import { NotificationMenu } from "./notification-menu";
import { ProfileMenu } from "./profile-menu";

export function Header() {
  const toggleMobileSidebar = useLayoutStore((state) => state.toggleMobileSidebar);
  const { userRole, setUserRole } = useLayoutStore();

  const handleSearch = (val: string) => {
    // UI Only search placeholder
    if (val) console.log("Searching for:", val);
  };

  return (
    <header className="h-16 shrink-0 border-b border-border bg-bg flex items-center justify-between px-6 sticky top-0 z-sticky select-none gap-4">
      {/* Left side: Hamburger menu + dynamic Breadcrumb navigation */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleMobileSidebar}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-full hover:bg-bg-secondary border border-border text-text-secondary hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent">SENOPATI</span>
          <Breadcrumb />
        </div>
      </div>

      {/* Center side: Search bar (visible on desktop) */}
      <div className="hidden lg:flex flex-1 justify-center max-w-md">
        <Search onSearch={handleSearch} placeholder="Cari kode aset, nama, lokasi..." />
      </div>

      {/* Right side: Role switcher, Notifications & Profile Menu */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mock Role Switcher Dropdown (helps user test Scoped RBAC dynamically) */}
        <div className="hidden sm:block">
          <Select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            options={[
              { value: "SuperAdmin", label: "Super Admin" },
              { value: "AssetManager", label: "Asset Manager" },
              { value: "Auditor", label: "Auditor" },
            ]}
            className="h-8.5 text-xs py-0 min-w-[130px]"
          />
        </div>

        <NotificationMenu />
        <div className="h-4 w-px bg-border" />
        <ProfileMenu />
      </div>
    </header>
  );
}
