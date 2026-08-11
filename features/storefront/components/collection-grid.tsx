import Link from "next/link";
import { ProductCard, type BarangCardData } from "./product-card";

export function CollectionGrid({ items }: { items: BarangCardData[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="h-px w-10 bg-gradient-to-r from-gold to-transparent mb-5" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-3">
            Koleksi
          </p>
          <h2 className="text-3xl font-semibold text-foreground">
            Pilihan Terbaik Kami
          </h2>
        </div>
        <Link
          href="/produk"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors group"
        >
          Lihat semua
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Belum ada produk untuk ditampilkan.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {items.map((barang) => (
            <ProductCard key={barang.id} barang={barang} />
          ))}
        </div>
      )}

      <Link
        href="/produk"
        className="block sm:hidden text-center text-sm font-medium text-gold hover:text-gold-dark transition-colors mt-8"
      >
        Lihat semua →
      </Link>
    </section>
  );
}