"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { StorefrontFooter } from "@/features/storefront/components/storefront-footer";
import { ArrowLeft, Gem, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-background flex flex-col">
      <StorefrontHeader />

      <section className="mx-auto max-w-5xl px-6 py-10 flex-1 w-full">
        <Link
          href="/produk"
          className="inline-flex items-center gap-2 text-sm text-emerald hover:underline mb-8"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Katalog
        </Link>

        {loading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : notFound || !barang ? (
          <p className="text-muted-foreground text-center py-16">Produk tidak ditemukan.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-10">
            {/* Foto */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
              {isValidPhoto(barang.photo) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={barang.photo}
                  alt={barang.nama}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Gem className="size-16 text-gold/50" strokeWidth={1.2} />
                </div>
              )}
              <div className="absolute top-4 right-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-card shadow-sm">
                <span className="font-mono text-sm font-semibold text-card-foreground">
                  {barang.karat}K
                </span>
              </div>
            </div>

            {/* Detail — gaya kartu appraisal */}
            <div>
              <h1 className="text-3xl font-semibold text-foreground">{barang.nama}</h1>
              <p className="text-2xl font-semibold text-emerald mt-3">
                {formatRupiah(barang.harga)}
              </p>

              <div className="mt-8 rounded-lg border border-border divide-y divide-border">
                {[
                  { label: "Barcode", value: barang.barcode },
                  { label: "Karat", value: `${barang.karat}K` },
                  { label: "Berat", value: `${barang.berat} gram` },
                  { label: "Kondisi", value: barang.kondisi },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-4 py-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {row.label}
                    </span>
                    <span className="font-mono text-sm text-foreground capitalize">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <StorefrontFooter />
    </div>
  );
}