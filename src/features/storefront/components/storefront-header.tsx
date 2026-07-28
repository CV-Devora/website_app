"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tentang", label: "About" },
  { href: "/kontak", label: "Contact" },
  { href: "/produk", label: "Product" },
];

export function StorefrontHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-wide text-cream-foreground">
          JASON JEWELRY
        </Link>
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-medium uppercase tracking-widest transition-opacity ${
                  active ? "text-cream-foreground" : "text-cream-foreground/70 hover:text-cream-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="flex size-7 items-center justify-center rounded-full border border-cream-foreground/25 text-cream-foreground/70 hover:text-cream-foreground hover:border-cream-foreground/50 transition-colors"
            title="Masuk"
          >
            <User className="size-3.5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}