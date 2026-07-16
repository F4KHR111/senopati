"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { UserRole } from "@/stores/layout-store";

export interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
    }
  }, [user, allowedRoles, router]);

  // If role is invalid, stop rendering children content
  if (user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
