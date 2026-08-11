"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
];

export function StorefrontHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isLanding = pathname === "/";

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!isLanding) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 transition-all duration-300 border-b border-gold/15 bg-background/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-wide transition-colors duration-300 z-50 text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="italic">Jason</span>{" "}
          <span className="font-light">Jewelry</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "text-gold"
                    : "text-muted-foreground hover:text-gold"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="text-sm font-medium px-5 py-2 rounded-full border transition-all duration-200 border-gold/30 text-foreground hover:border-gold hover:text-gold"
          >
            {isLoggedIn ? "Dashboard" : "Masuk"}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50 p-2 -mr-2 transition-colors duration-200 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-2xl font-medium transition-colors duration-200 ${
                  active ? "text-gold" : "text-muted-foreground hover:text-gold"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="text-lg font-medium px-8 py-3 mt-4 rounded-full border border-gold/40 text-foreground hover:bg-gold hover:text-white transition-all duration-200 shadow-gold-glow"
          >
            {isLoggedIn ? "Masuk ke Dashboard" : "Masuk ke Sistem"}
          </Link>
        </div>
      </div>
    </header>
  );
}