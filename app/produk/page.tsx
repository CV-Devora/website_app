"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Topbar } from "@/features/storefront/components/topbar";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { FooterFull } from "@/features/storefront/components/footer-full";
import { ProductCard, type BarangCardData } from "@/features/storefront/components/product-card";
import { Loader2, Gem, Search, SlidersHorizontal, X } from "lucide-react";

function ProdukContent() {
  const searchParams = useSearchParams();
  const initialKarat = searchParams.get("karat");

  const [barangs, setBarangs] = useState<BarangCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(initialKarat ?? "all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.barangLanding
      .list()
      .then((res) => setBarangs(res.data as BarangCardData[]))
      .catch((err) => console.error("Failed to fetch barang landing:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = barangs;

    // Apply filter
    if (activeFilter !== "all") {
      result = result.filter((b) => parseInt(b.karat, 10) === parseInt(activeFilter, 10));
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => b.nama.toLowerCase().includes(q));
    }

    return result;
  }, [barangs, activeFilter, searchQuery]);

  return (
    <div className="theme-storefront min-h-screen bg-background text-foreground flex flex-col">
      <StorefrontHeader />

      {/* Page hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-background to-background" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">
              Katalog Lengkap
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground leading-tight">
            Koleksi Perhiasan
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg leading-relaxed">
            Semua perhiasan tersedia, lengkap dengan karat, berat, dan kondisi yang terverifikasi.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 sm:py-10">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-5 sm:mb-8">
          {/* Search input */}
          <div className="relative flex-1 max-w-full sm:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full h-10 pl-10 pr-9 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-border" />
            <p className="text-xs text-muted-foreground shrink-0 font-mono">
              {filtered.length} produk ditemukan
              {(activeFilter !== "all" || searchQuery) && (
                <button
                  onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
                  className="ml-2 text-gold hover:text-gold-dark transition-colors"
                >
                  · Reset filter
                </button>
              )}
            </p>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="size-8 animate-spin text-gold/50" />
            <p className="text-sm text-muted-foreground">Memuat produk...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <Gem className="size-14 text-gold/15 mx-auto mb-5" strokeWidth={1} />
            <p className="text-foreground font-medium mb-2">Tidak ada produk ditemukan</p>
            <p className="text-sm text-muted-foreground mb-5">
              Coba ubah filter atau kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-2 text-sm text-gold hover:bg-gold/5 transition-all duration-200"
            >
              <X className="size-3.5" />
              Reset semua filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map((barang) => (
              <ProductCard key={barang.id} barang={barang} />
            ))}
          </div>
        )}
      </section>

      <FooterFull />
    </div>
  );
}

export default function ProdukPage() {
  return (
    <Suspense
      fallback={
        <div className="theme-storefront min-h-screen bg-background text-foreground flex flex-col">
          <StorefrontHeader />
          <div className="flex-1 flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="size-8 animate-spin text-gold/50" />
            <p className="text-sm text-muted-foreground">Memuat produk...</p>
          </div>
          <FooterFull />
        </div>
      }
    >
      <ProdukContent />
    </Suspense>
  );
}