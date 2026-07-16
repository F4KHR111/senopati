"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { ToastContainer } from "@/shared/components";

/**
 * AppProviders menggabungkan seluruh provider aplikasi.
 * Urutan nesting: QueryProvider → (provider lain di masa depan)
 * Satu file ini menjadi satu-satunya tempat menambahkan provider baru.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <ToastContainer />
    </QueryProvider>
  );
}

