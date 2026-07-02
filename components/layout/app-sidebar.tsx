"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Gem } from "lucide-react";
import { useSidebar } from "@/components/layout/sidebar-context";
import { NavLinks } from "@/components/layout/nav-links";
import { cn } from "@/lib/utils";

export function AppSidebar() {
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
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-sidebar-foreground",
          "border-r border-sidebar-border transition-all duration-300 ease-in-out",
          collapsed ? "w-[64px]" : "w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo / Brand */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-sidebar-border px-3",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
              <Gem className="size-4 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
                  Toko Emas
                </p>
                <p className="truncate text-[10px] text-sidebar-foreground/50">
                  Jason Jewelry
                </p>
              </div>
            )}
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex size-6 items-center justify-center rounded text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          <NavLinks collapsed={collapsed} />
        </nav>
      </aside>
    </>
  );
}
