"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const routeLabelMap: Record<string, string> = {
  dashboard: "Dashboard",
  map: "Interactive Map",
  vehicle: "Kendaraan",
  art: "Benda Seni",
  inventory: "Inventaris",
  linen: "Linen",
  supply: "Persediaan",
  reports: "Laporan",
  audit: "Audit Logs",
  users: "Pengguna",
  settings: "Pengaturan",
};

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className={cn("flex items-center space-x-1.5 text-xs font-medium text-text-tertiary", className)} aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-text-primary transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const label = routeLabelMap[segment] || segment;

        // Skip rendering "dashboard" segment if it is the first segment and there are others
        if (segment === "dashboard" && segments.length > 1) return null;

        return (
          <div key={href} className="flex items-center space-x-1.5">
            <ChevronRight className="h-3 w-3 shrink-0 text-text-tertiary/60" />
            {isLast ? (
              <span className="text-text-primary font-semibold truncate max-w-[120px] sm:max-w-none">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-text-primary transition-colors truncate max-w-[100px] sm:max-w-none">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
