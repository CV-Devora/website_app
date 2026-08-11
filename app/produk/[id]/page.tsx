"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Topbar } from "@/features/storefront/components/topbar";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { FooterFull } from "@/features/storefront/components/footer-full";
import { ArrowLeft, Gem, Loader2, Shield, Weight, Tag, Barcode } from "lucide-react";

interface Barang {
  id: string;
  barcode: string;
  nama: string;
  karat: number;
  berat: number;
  harga: number;
  photo?: string;
  kondisi: string;
}

function isValidPhoto(url?: string) {
  return !!url && /^https?:\/\//.test(url);
}

function formatRupiah(number: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

const detailIcons: Record<string, React.ReactNode> = {
  Barcode: <Barcode className="size-4 text-gold/60" />,
  Karat: <Shield className="size-4 text-gold/60" />,
  Berat: <Weight className="size-4 text-gold/60" />,
  Kondisi: <Tag className="size-4 text-gold/60" />,
};

export default function ProdukDetailPage() {
  const params = useParams<{ id: string }>();
  const [barang, setBarang] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.barang
      .get(params.id)
      .then((res) => setBarang(res.data as Barang))
      .catch((err) => {
        console.error("Failed to fetch barang detail:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="theme-storefront min-h-screen bg-background text-foreground flex flex-col">
      <Topbar />
      <StorefrontHeader />

      <section className="mx-auto max-w-5xl px-6 py-10 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-muted-foreground hover:text-gold transition-colors">
            Beranda
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <Link href="/produk" className="text-muted-foreground hover:text-gold transition-colors">
            Katalog
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {barang?.nama ?? "Detail"}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <Loader2 className="size-8 animate-spin text-gold/50" />
            <p className="text-sm text-muted-foreground">Memuat detail produk...</p>
          </div>
        ) : notFound || !barang ? (
          <div className="text-center py-20">
            <Gem className="size-16 text-gold/15 mx-auto mb-4" strokeWidth={1} />
            <p className="text-muted-foreground text-lg">Produk tidak ditemukan.</p>
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-dark mt-4 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Kembali ke Katalog
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-12">
            {/* Photo */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
              {isValidPhoto(barang.photo) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={barang.photo}
                  alt={barang.nama}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-accent">
                  <div className="flex flex-col items-center gap-3">
                    <Gem className="size-20 text-gold/30" strokeWidth={0.8} />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold/25">
                      Jason Jewelry
                    </span>
                  </div>
                </div>
              )}

              {/* Karat badge */}
              <div className="absolute top-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-dark to-gold shadow-lg">
                <span className="font-mono text-sm font-bold text-white">
                  {typeof barang.karat === "object" && barang.karat ? (barang.karat as any).name : barang.karat}K
                </span>
              </div>

              {barang.kondisi === "bekas" && (
                <div className="absolute top-5 left-5 rounded-full bg-foreground/85 backdrop-blur-sm px-3 py-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-background font-medium">
                    Bekas
                  </span>
                </div>
              )}
            </div>

            {/* Detail */}
            <div>
              <h1 className="text-3xl font-semibold text-foreground">{barang.nama}</h1>
              <p className="text-2xl font-semibold text-gold mt-4">
                {formatRupiah(barang.harga)}
              </p>

              <div className="gold-divider mt-8 mb-8" />

              {/* Detail card – appraisal style */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-gradient-to-r from-gold/5 to-transparent px-5 py-3 border-b border-border">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                    Detail Produk
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { label: "Barcode", value: barang.barcode },
                    { label: "Karat", value: `${typeof barang.karat === "object" && barang.karat ? (barang.karat as any).name : barang.karat}K` },
                    { label: "Berat", value: `${barang.berat} gram` },
                    { label: "Kondisi", value: barang.kondisi },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        {detailIcons[row.label]}
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          {row.label}
                        </span>
                      </div>
                      <span className="font-mono text-sm text-foreground capitalize font-medium">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA / Contact */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/628123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-gold-glow hover:scale-[1.01]"
                >
                  Hubungi via WhatsApp
                </a>
                <Link
                  href="/produk"
                  className="flex-1 text-center rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-gold/40 hover:text-gold"
                >
                  Lihat Lainnya
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <FooterFull />
    </div>
  );
}