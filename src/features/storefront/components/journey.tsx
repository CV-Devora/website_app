export function Journey() {
  return (
    <section id="journey" className="bg-olive py-16">
      <div className="mx-auto max-w-6xl px-6 grid sm:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
        {/* Gambar dengan bingkai aksen dekoratif */}
        <div className="relative">
          <div className="absolute -left-4 top-4 bottom-4 w-3 bg-rose-start hidden sm:block" />
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden border-4 border-cream">
            {/* Ganti /public/journey-image.jpg dengan foto produk/proses asli */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/journey-image.jpg"
              alt="Perjalanan Jason Jewelry"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 -left-1 size-10 bg-cream hidden sm:block" />
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy">
            Manajemen
          </p>
          <p className="text-sm text-navy/90 leading-relaxed mt-4 max-w-lg mx-auto">
            Berawal dari usaha keluarga kecil, Jason Jewelry tumbuh menjadi
            perusahaan emas terpercaya. Setiap produk Jason Jewelry lahir dari
            ketelitian dan komitmen menjaga kemurnian, sehingga setiap
            pelanggan dapat merasa yakin dengan setiap barang yang mereka
            miliki.
          </p>
          <p className="text-6xl sm:text-7xl font-semibold text-cream mt-6">
            12 Tahun
          </p>
        </div>
      </div>
    </section>
  );
}