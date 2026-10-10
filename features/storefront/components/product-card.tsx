import Link from "next/link";
import { Gem, ArrowRight } from "lucide-react";
import { resolvePhotoUrl } from "@/lib/api";

export interface BarangCardData {
  id: string;
  nama: string;
  karat: string;
  berat: number;
  harga: number;
  photo?: string;
  kondisi?: string;
}

function formatRupiah(number: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

export function ProductCard({ barang }: { barang: BarangCardData }) {
  const photoUrl = resolvePhotoUrl(barang.photo);
  const karatLabel = barang.karat;

  return (
    <Link
      href={`/produk/${barang.id}`}
      className="group block rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-gold-glow hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={barang.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-accent">
            <div className="flex flex-col items-center gap-2 opacity-50">
              <Gem className="size-10 text-gold/60" strokeWidth={1} />
              <span className="font-mono text-[9px] uppercase tracking-widest text-gold/40">
                Jewelry
              </span>
            </div>
          </div>
        )}

        {/* Karat badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center justify-center rounded-full bg-gradient-to-br from-gold-dark to-gold shadow-md px-2.5 py-1">
          <span className="font-mono text-[10px] font-bold text-white">{karatLabel}K</span>
        </div>

        {/* Kondisi badge */}
        {barang.kondisi === "bekas" && (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-foreground/80 backdrop-blur-sm px-2.5 py-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-background font-medium">
              Bekas
            </span>
          </div>
        )}

        {/* Hover overlay with see detail */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center pb-4">
          <span className="inline-flex items-center gap-1.5 text-white text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Lihat Detail
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-card-foreground line-clamp-1 group-hover:text-gold transition-colors duration-200 mb-1">
          {barang.nama}
        </h3>
        <p className="font-mono text-[11px] text-muted-foreground">
          {barang.berat} gr · {karatLabel}K
        </p>
        <p className="text-sm font-bold text-gold mt-2">
          {formatRupiah(barang.harga)}
        </p>
      </div>
    </Link>
  );
}