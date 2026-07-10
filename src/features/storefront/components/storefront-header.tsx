"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
];

export function StorefrontHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isLanding = pathname === "/";

  useEffect(() => {
    if (!isLanding) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding]);

  const transparent = isLanding && !scrolled;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors ${
        transparent
          ? "bg-transparent border-transparent"
          : "border-b border-border bg-background/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className={`text-xl font-semibold italic ${transparent ? "text-white" : "text-foreground"}`}
        >
          Jason Jewelry
        </Link>
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  transparent
                    ? active
                      ? "text-white font-medium"
                      : "text-white/80 hover:text-white"
                    : active
                      ? "text-emerald font-medium"
                      : "text-muted-foreground hover:text-emerald"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className={`text-sm transition-colors ${
              transparent ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Masuk
          </Link>
        </nav>
      </div>
    </header>
  );
}