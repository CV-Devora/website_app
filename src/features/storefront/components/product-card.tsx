import Link from "next/link";
import { Gem } from "lucide-react";

export interface BarangCardData {
  id: string;
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

export function ProductCard({ barang }: { barang: BarangCardData }) {
  const validPhoto = isValidPhoto(barang.photo);

  return (
    <Link
      href={`/produk/${barang.id}`}
      className="group block rounded-lg border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square bg-muted">
        {validPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={barang.photo}
            alt={barang.nama}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Gem className="size-10 text-gold/50" strokeWidth={1.2} />
          </div>
        )}

        {/* Hallmark badge */}
        <div className="absolute top-3 right-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold bg-card shadow-sm">
          <span className="font-mono text-xs font-semibold text-card-foreground">
            {barang.karat}K
          </span>
        </div>

        {barang.kondisi === "bekas" && (
          <div className="absolute top-3 left-3 rounded-full bg-foreground/80 px-2 py-0.5">
            <span className="font-mono text-[10px] uppercase tracking-wide text-background">
              Bekas
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-card-foreground line-clamp-1">
          {barang.nama}
        </h3>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          {barang.berat} gr
        </p>
        <p className="text-lg font-semibold text-emerald mt-2">
          {formatRupiah(barang.harga)}
        </p>
      </div>
    </Link>
  );
}