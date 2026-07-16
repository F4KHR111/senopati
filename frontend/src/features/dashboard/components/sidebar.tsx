"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Car,
  Paintbrush,
  Laptop,
  Shirt,
  Package,
  Map,
  History,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/map", label: "Interactive Map", icon: Map },
  { href: "/dashboard/vehicle", label: "Kendaraan", icon: Car },
  { href: "/dashboard/art", label: "Benda Seni", icon: Paintbrush },
  { href: "/dashboard/inventory", label: "Inventaris", icon: Laptop },
  { href: "/dashboard/linen", label: "Linen", icon: Shirt },
  { href: "/dashboard/supply", label: "Persediaan", icon: Package },
  { href: "/dashboard/reports", label: "Laporan", icon: FileText },
  { href: "/dashboard/audit", label: "Audit Logs", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebarCollapse, isMobileSidebarOpen, setMobileSidebar } =
    useLayoutStore();

  const handleNavClick = () => {
    if (isMobileSidebarOpen) setMobileSidebar(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-primary text-text-inverse border-r border-primary-light">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-primary-light">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={handleNavClick}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          {!isSidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-base font-bold tracking-wider text-text-inverse"
            >
              SENOPATI
            </motion.span>
          )}
        </Link>
        {!isSidebarCollapsed && (
          <button
            onClick={toggleSidebarCollapse}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded-md hover:bg-primary-light text-text-tertiary hover:text-text-inverse transition-colors"
            aria-label="Tutup sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "group flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors",
                isActive
                  ? "bg-accent text-primary font-bold shadow-sm"
                  : "text-text-tertiary hover:bg-primary-light hover:text-text-inverse"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-text-tertiary group-hover:text-text-inverse"
                )}
              />
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle Expand when collapsed */}
      {isSidebarCollapsed && (
        <div className="hidden md:flex h-12 items-center justify-center border-t border-primary-light">
          <button
            onClick={toggleSidebarCollapse}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-primary-light text-text-tertiary hover:text-text-inverse transition-colors"
            aria-label="Buka sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Collapsible with width animation) */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="hidden md:block shrink-0 h-screen sticky top-0 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer (Overlay backdrop & content slide-in) */}
      <div className={cn("fixed inset-0 z-sticky md:hidden pointer-events-none", isMobileSidebarOpen && "pointer-events-auto")}>
        {/* Mobile Sidebar backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebar(false)}
            className="fixed inset-0 bg-primary/45 backdrop-blur-xs transition-opacity duration-300"
          />
        )}

        {/* Mobile Sidebar container */}
        <div
          className={cn(
            "fixed top-0 bottom-0 left-0 w-[260px] transform transition-transform duration-300 ease-in-out z-sticky",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
