"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { StorefrontFooter } from "@/features/storefront/components/storefront-footer";
import { ProductCard, type BarangCardData } from "@/features/storefront/components/product-card";
import { Loader2 } from "lucide-react";

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
    return barangs.filter((b) => b.karat === parseInt(activeFilter, 10));
  }, [barangs, activeFilter]);

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-semibold text-foreground">Katalog Produk</h1>
        <p className="text-muted-foreground mt-2">
          Semua perhiasan tersedia, lengkap dengan karat dan berat.
        </p>

        <div className="flex flex-wrap gap-2 mt-6">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                activeFilter === f.value
                  ? "bg-emerald border-emerald text-white"
                  : "border-border text-muted-foreground hover:border-gold"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">
              Tidak ada produk yang cocok dengan filter ini.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((barang) => (
                <ProductCard key={barang.id} barang={barang} />
              ))}
            </div>
          )}
        </div>
      </section>

      <StorefrontFooter />
    </div>
  );
}