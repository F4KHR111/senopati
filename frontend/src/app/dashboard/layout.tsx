"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import { Header } from "@/features/dashboard/components/header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg">
      {/* Pinned Collapsible Sidebar */}
      <Sidebar />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Pinned Top Header */}
        <Header />

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto bg-bg-secondary p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
