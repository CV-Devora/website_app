import Link from "next/link";
import { ProductCard, type BarangCardData } from "./product-card";
import { ArrowRight, Gem } from "lucide-react";

export function CollectionGrid({ items }: { items: BarangCardData[] }) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gradient-to-r from-gold to-transparent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
                Koleksi Pilihan
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-snug">
              Pilihan Terbaik Kami
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md leading-relaxed">
              Perhiasan pilihan dengan kualitas dan kemurnian yang telah diverifikasi.
            </p>
          </div>
          <Link
            href="/produk"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors group shrink-0"
          >
            Lihat semua koleksi
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Gem className="size-12 text-gold/20 mx-auto mb-4" strokeWidth={1} />
            <p className="text-muted-foreground">Belum ada produk untuk ditampilkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((barang) => (
              <ProductCard key={barang.id} barang={barang} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="sm:hidden text-center mt-10">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors group"
          >
            Lihat semua koleksi
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}