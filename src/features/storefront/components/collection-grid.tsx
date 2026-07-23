"use client";

import { useState } from "react";
import { PhotoOnlyCard, type PhotoCardData } from "./photo-only-card";

const categories = ["Cincin", "Anting", "Kalung", "Gelang", "Logam Mulia", "Lainnya"];

export function CollectionGrid({ items }: { items: PhotoCardData[] }) {
  const [active, setActive] = useState(categories[0]);

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-cream-foreground">
          Koleksi Perhiasan Jason Jewelry
        </h2>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-xs font-medium uppercase tracking-wide pb-1 border-b-2 transition-colors ${
                active === cat
                  ? "border-olive text-cream-foreground"
                  : "border-transparent text-cream-foreground/50 hover:text-cream-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 mt-10">
          {items.slice(0, 10).map((barang) => (
            <PhotoOnlyCard key={barang.id} barang={barang} />
          ))}
        </div>
      </div>
    </section>
  );
}