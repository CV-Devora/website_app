import Link from "next/link";
import { ProductCard, type BarangCardData } from "./product-card";

export function CollectionGrid({ items }: { items: BarangCardData[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald mb-3">
            Koleksi
          </p>
          <h2 className="text-3xl font-semibold text-foreground">Pilihan Terbaik Kami</h2>
        </div>
        <Link href="/produk" className="text-sm text-emerald hover:underline hidden sm:block">
          Lihat semua →
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

      <Link href="/produk" className="block sm:hidden text-center text-sm text-emerald hover:underline mt-6">
        Lihat semua →
      </Link>
    </section>
  );
}