import Link from "next/link";
import { Gem } from "lucide-react";

export interface PhotoCardData {
  id: string;
  nama: string;
  photo?: string;
}

function isValidPhoto(url?: string) {
  return !!url && /^https?:\/\//.test(url);
}

export function PhotoOnlyCard({ barang }: { barang: PhotoCardData }) {
  const validPhoto = isValidPhoto(barang.photo);

  return (
    <Link
      href={`/produk/${barang.id}`}
      className="group block aspect-square overflow-hidden bg-muted"
    >
      {validPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={barang.photo}
          alt={barang.nama}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Gem className="size-8 text-gold/40" strokeWidth={1.2} />
        </div>
      )}
    </Link>
  );
}