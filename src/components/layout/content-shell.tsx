"use client";

import { useSidebar } from "@/components/layout/sidebar-context";
import { Header } from "@/components/layout/header";

export function ContentShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div
      className="flex min-h-screen flex-col bg-gray-50 transition-all duration-200 dark:bg-zinc-950"
      style={{ marginLeft: collapsed ? 64 : 240 }}
    >
      <Header />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
