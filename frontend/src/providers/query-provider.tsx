"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * QueryProvider membungkus aplikasi dengan TanStack Query.
 * Konfigurasi QueryClient disesuaikan untuk pengalaman enterprise:
 * - staleTime 60 detik: mengurangi refetch berlebihan
 * - retry 1 kali: menghindari UI stuck pada error
 * - refetchOnWindowFocus false: menghindari request tak terduga
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
