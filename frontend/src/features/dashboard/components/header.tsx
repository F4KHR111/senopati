"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useLayoutStore } from "@/stores";
import { NotificationMenu } from "./notification-menu";
import { ProfileMenu } from "./profile-menu";

const routeLabelMap: Record<string, string> = {
  "/dashboard": "Dashboard Utama",
  "/dashboard/map": "Interactive Map Engine",
  "/dashboard/vehicle": "Manajemen Kendaraan",
  "/dashboard/art": "Koleksi Benda Seni",
  "/dashboard/inventory": "Manajemen Inventaris",
  "/dashboard/linen": "Siklus Linen",
  "/dashboard/supply": "Persediaan & ATK",
  "/dashboard/reports": "Pelaporan Terintegrasi",
  "/dashboard/audit": "Audit & History Logs",
};

export function Header() {
  const pathname = usePathname();
  const toggleMobileSidebar = useLayoutStore((state) => state.toggleMobileSidebar);

  // Breadcrumbs title helper
  const getPageTitle = () => {
    return routeLabelMap[pathname] || "SENOPATI Platform";
  };

  return (
    <header className="h-16 shrink-0 border-b border-border bg-bg flex items-center justify-between px-6 sticky top-0 z-sticky">
      {/* Left side: Hamburger menu + Breadcrumbs title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-full hover:bg-bg-secondary border border-border text-text-secondary hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <h1 className="text-sm font-semibold text-text-primary hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: Actions & User Profiling */}
      <div className="flex items-center gap-3">
        <NotificationMenu />
        <div className="h-4 w-px bg-border hidden sm:block" />
        <ProfileMenu />
      </div>
    </header>
  );
}
