"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore, useLayoutStore } from "@/stores";
import { Spinner } from "@/shared/components";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isChecking, checkAuth } = useAuthStore();
  const setUserRole = useLayoutStore((state) => state.setUserRole);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Sinkronisasikan role pengguna aktif dengan layout store untuk filter navigasi sidebar
  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
    }
  }, [user, setUserRole]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-bg gap-4">
        <Spinner size="lg" className="text-accent" />
        <p className="text-xs font-medium text-text-secondary tracking-wide animate-pulse">
          Memuat sesi sistem...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
