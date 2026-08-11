import Link from "next/link";
import { Gem } from "lucide-react";

export interface BarangCardData {
  id: string;
  nama: string;
  karat: any;
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

export function ProductCard({ barang }: { barang: BarangCardData }) {
  const validPhoto = isValidPhoto(barang.photo);

  return (
    <Link
      href={`/produk/${barang.id}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-gold/40 hover:shadow-gold-glow"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        {validPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={barang.photo}
            alt={barang.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-accent">
            <div className="flex flex-col items-center gap-2">
              <Gem className="size-12 text-gold/40" strokeWidth={1} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-gold/30">
                Jewelry
              </span>
            </div>
          </div>
        )}

        {/* Karat hallmark badge */}
        <div className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-dark to-gold shadow-md">
          <span className="font-mono text-xs font-bold text-white">
            {typeof barang.karat === "object" && barang.karat ? (barang.karat as any).name : barang.karat}K
          </span>
        </div>

        {barang.kondisi === "bekas" && (
          <div className="absolute top-3 left-3 rounded-full bg-foreground/85 backdrop-blur-sm px-2.5 py-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-background font-medium">
              Bekas
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-card-foreground line-clamp-1 group-hover:text-gold transition-colors duration-200">
          {barang.nama}
        </h3>
        <p className="font-mono text-xs text-muted-foreground mt-1.5">
          {barang.berat} gr
        </p>
        <p className="text-base font-semibold text-gold mt-2">
          {formatRupiah(barang.harga)}
        </p>
      </div>
    </Link>
  );
}