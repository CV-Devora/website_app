export function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
      {/* Ganti /public/hero-image.jpg dengan foto toko/produk asli */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-image.jpg"
        alt="Jason Jewelry"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy/55" />

      {/* Watermark besar samar */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="text-[10vw] font-semibold text-white/10 whitespace-nowrap select-none">
          JASON JEWELRY
        </span>
      </div>

      <div className="relative z-10 flex h-full items-end pb-14 px-6">
        <div className="mx-auto max-w-6xl w-full">
          <blockquote className="max-w-md">
            <p className="text-sm sm:text-base font-medium italic text-white leading-relaxed uppercase">
              &ldquo;Berbagai pijakan untuk perusahaan emas menghasilkan yang
              membutuhkan kepercayaan, kemurnian, dan kepuasan pelanggan.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}