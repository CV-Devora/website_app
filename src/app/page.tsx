"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { StorefrontFooter } from "@/features/storefront/components/storefront-footer";
import { ProductCard, type BarangCardData } from "@/features/storefront/components/product-card";
import { HallmarkStamp } from "@/components/shared/hallmark-stamp";
import { Loader2 } from "lucide-react";

const categories = [
  { label: "24K", karat: 24 },
  { label: "22K", karat: 22 },
  { label: "18K", karat: 18 },
];

export default function LandingPage() {
  const [featured, setFeatured] = useState<BarangCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.barang
      .list()
      .then((res) => setFeatured((res.data as BarangCardData[]).slice(0, 4)))
      .catch((err) => console.error("Failed to fetch featured barang:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24 grid sm:grid-cols-[1.3fr_1fr] gap-10 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald mb-4">
            Toko Emas Terpercaya
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground leading-tight">
            Setiap perhiasan, <span className="italic text-emerald">bertera kemurnian.</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-md">
            Jelajahi koleksi perhiasan emas kami — setiap barang tercatat karat,
            berat, dan kondisinya dengan jelas, tanpa keraguan.
          </p>
          <Link
            href="/produk"
            className="inline-block mt-8 rounded-md bg-emerald px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Lihat Katalog
          </Link>
        </div>
        <div className="mx-auto w-48 sm:w-64">
          <HallmarkStamp />
        </div>
      </section>

      {/* Kategori */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald mb-4">
          Kategori Karat
        </p>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.karat}
              href={`/produk?karat=${cat.karat}`}
              className="rounded-full border border-gold px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-gold hover:text-background"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Produk unggulan */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Produk Unggulan</h2>
          <Link href="/produk" className="text-sm text-emerald hover:underline">
            Lihat semua →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : featured.length === 0 ? (
          <p className="text-muted-foreground">Belum ada produk untuk ditampilkan.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {featured.map((barang) => (
              <ProductCard key={barang.id} barang={barang} />
            ))}
          </div>
        )}
      </section>

      <StorefrontFooter />
    </div>
  );
}