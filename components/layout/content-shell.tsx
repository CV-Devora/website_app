"use client";

import { useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";

export function ContentShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <main
      className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        "pt-16", // header height
        collapsed ? "lg:pl-[64px]" : "lg:pl-[240px]"
      )}
    >
      <div className="mx-auto max-w-screen-2xl p-6">{children}</div>
    </main>
  );
}
