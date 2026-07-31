"use client";

import { Menu, Bell, Search, LogOut, User } from "lucide-react";
import { useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { collapsed, toggle, setMobileOpen } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-20 flex h-16 items-center gap-4",
        "border-b border-border bg-background/95 backdrop-blur-sm",
        "px-4 transition-all duration-300 ease-in-out",
        collapsed ? "left-[64px]" : "left-[240px]",
        "lg:left-auto",
      )}
      style={{
        width: `calc(100% - ${collapsed ? "64px" : "240px"})`,
      }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="size-4" />
      </button>

      {/* Desktop collapse toggle */}
      <button
        onClick={toggle}
        className="hidden size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:flex"
        aria-label="Toggle sidebar"
      >
        <Menu className="size-4" />
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-2">
        <div className="relative hidden max-w-sm flex-1 sm:flex">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Cari data..."
            className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
        </button>

        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold select-none">
          A
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="hidden gap-1.5 text-muted-foreground hover:text-foreground sm:flex"
        >
          <LogOut className="size-3.5" />
          <span className="text-xs">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
