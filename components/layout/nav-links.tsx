"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Gem,
  ShoppingCart,
  Settings,
  Users,
  Star,
  BoxIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group?: string;
  allowedRoles: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Utama", allowedRoles: ["admin", "kasir", "sales"] },
  { label: "Barang", href: "/barang", icon: Gem, group: "Inventaris", allowedRoles: ["admin", "kasir", "sales"] },
  { label: "Baki", href: "/baki", icon: BoxIcon, group: "Inventaris", allowedRoles: ["admin", "kasir", "sales"] },
  { label: "Pembelian", href: "/pembelian", icon: ShoppingCart, group: "Transaksi", allowedRoles: ["admin", "kasir", "sales"] },
  { label: "Penjualan", href: "/penjualan", icon: ShoppingBag, group: "Transaksi", allowedRoles: ["admin", "kasir", "sales"] },
  { label: "Karat", href: "/karat", icon: Star, group: "Master", allowedRoles: ["admin", "sales"] },
  { label: "Pengguna", href: "/users", icon: Users, group: "Master", allowedRoles: ["admin"] },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings, group: "Sistem", allowedRoles: ["admin"] },
];

export function NavLinks({ collapsed }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role?.toLowerCase());
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
  }, []);

  // Filter items based on user role
  const filteredItems = navItems.filter((item) => {
    if (!userRole) return false;
    return item.allowedRoles.includes(userRole) || userRole === "admin";
  });

  // Group items
  const groups = filteredItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    const g = item.group ?? "Lainnya";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  // Do not render anything until we know the user role (to prevent hydration mismatch/flickering UI)
  if (!userRole) return null;

  return (
    <div className="flex flex-col gap-1">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="mb-2">
          {!collapsed && (
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 select-none">
              {group}
            </p>
          )}
          {items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
