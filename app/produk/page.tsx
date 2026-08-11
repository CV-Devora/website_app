"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Topbar } from "@/features/storefront/components/topbar";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { FooterFull } from "@/features/storefront/components/footer-full";
import { ProductCard, type BarangCardData } from "@/features/storefront/components/product-card";
import { Loader2, Gem, SlidersHorizontal } from "lucide-react";

const filters = [
  { label: "Semua", value: "all" },
  { label: "24K", value: "24" },
  { label: "22K", value: "22" },
  { label: "18K", value: "18" },
  { label: "Baru", value: "baru" },
  { label: "Bekas", value: "bekas" },
];

export default function ProdukPage() {
  const searchParams = useSearchParams();
  const initialKarat = searchParams.get("karat");

  const [barangs, setBarangs] = useState<BarangCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(initialKarat ?? "all");

  useEffect(() => {
    api.barang
      .list()
      .then((res) => setBarangs(res.data as BarangCardData[]))
      .catch((err) => console.error("Failed to fetch barang:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return barangs;
    if (activeFilter === "baru" || activeFilter === "bekas") {
      return barangs.filter((b) => b.kondisi === activeFilter);
    }
    return barangs.filter((b) => {
      const k = typeof b.karat === "object" && b.karat ? (b.karat as any).name : b.karat;
      return parseInt(k, 10) === parseInt(activeFilter, 10);
    });
  }, [barangs, activeFilter]);

  return (
    <div className="theme-storefront min-h-screen bg-background text-foreground flex flex-col">
      <Topbar />
      <StorefrontHeader />

      {/* Page hero header */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-accent" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-gold/10">
              <Gem className="size-5 text-gold" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-gold/20 to-transparent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
            Katalog Produk
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md leading-relaxed">
            Semua perhiasan tersedia, lengkap dengan karat dan berat.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="mx-auto max-w-6xl px-6 py-10 flex-1 w-full">
        <div className="flex items-center gap-3 mb-6">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Filter</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium border transition-all duration-200 ${
                activeFilter === f.value
                  ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light border-gold/30 text-white shadow-sm"
                  : "border-border text-muted-foreground hover:border-gold/40 hover:text-gold"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-muted-foreground mb-6">
            Menampilkan <span className="font-medium text-foreground">{filtered.length}</span> produk
          </p>
        )}

        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <Loader2 className="size-8 animate-spin text-gold/50" />
              <p className="text-sm text-muted-foreground">Memuat produk...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Gem className="size-12 text-gold/20 mx-auto mb-4" strokeWidth={1} />
              <p className="text-muted-foreground">
                Tidak ada produk yang cocok dengan filter ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((barang) => (
                <ProductCard key={barang.id} barang={barang} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterFull />
    </div>
  );
}