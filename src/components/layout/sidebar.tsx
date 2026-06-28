"use client";

import { useEffect } from "react";
import { Gem, PanelLeftClose, PanelLeft, X } from "lucide-react";
import { useSidebar } from "@/components/layout/sidebar-context";
import { NavLinks } from "@/components/layout/nav-links";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setMobileOpen]);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-blue-950 text-white dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 transition-all duration-200",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-2 my-1 dark:border-zinc-700">
          <div className="flex items-center gap-1 overflow-hidden">
            <div className="flex shrink-0 items-center justify-center">
              <img src="/jason.png" className="w-24 h-32 mt-4" alt="Jason Jewelry" />
            </div>
            {!collapsed && (
              <span className="truncate text-md font-semibold tracking-tight">
                Jason Jewelry
              </span>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex size-6 shrink-0 items-center justify-center rounded text-blue-200 hover:bg-blue-900 dark:text-zinc-400 dark:hover:bg-zinc-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <NavLinks collapsed={collapsed} />
        </nav>
      </aside>
    </>
  );
}
