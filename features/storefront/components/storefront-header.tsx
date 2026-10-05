"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Gem } from "lucide-react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/layanan", label: "Layanan" },
  { href: "/kontak", label: "Kontak" },
];

export function StorefrontHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top bar background */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          scrolled
            ? "bg-[#FBF9F1]/95 backdrop-blur-xl shadow-sm border-b border-gold/10"
            : "bg-[#FBF9F1] border-b border-transparent"
        }`}
      />

      <div className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex items-center justify-center rounded-full group-hover:shadow-gold-glow transition-all duration-300">
            <img src="/jason.png" className="w-12 h-8" alt="Jason Jewelry" />
          </div>
          <span className="text-lg font-semibold tracking-wide text-foreground">
            <span className="italic text-gold">Jason</span>{" "}
            <span className="font-light">Jewelry</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active
                    ? "text-gold bg-gold/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="text-sm font-medium px-5 py-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-white shadow-sm hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-200" 
          >
            {isLoggedIn ? "Dashboard" : "Masuk"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center size-9 rounded-lg border border-border hover:border-gold/30 transition-colors duration-200 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-0 left-0 w-screen h-screen z-40 bg-[#FBF9F1] dark:bg-background transition-all duration-300 ease-in-out md:hidden flex flex-col ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="flex flex-col h-full pt-20 pb-10 px-6 overflow-y-auto">
          {/* Mobile Nav Items */}
          <nav className="flex flex-col gap-1.5 mb-8">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                    active
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {item.label}
                  {active && <ChevronDown className="size-4 rotate-[-90deg]" />}
                </Link>
              );
            })}
          </nav>

          {/* Mobile CTA buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            <Link
              href="/produk"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-base font-medium py-3.5 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-white shadow-gold-glow hover:scale-[1.01] transition-all duration-200"
            >
              Lihat Koleksi
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-base font-medium py-3.5 rounded-xl border border-border text-foreground hover:border-gold/30 hover:text-gold transition-all duration-200"
            >
              {isLoggedIn ? "Masuk ke Dashboard" : "Masuk ke Sistem"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}