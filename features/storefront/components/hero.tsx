import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      {/* Background image */}
      <img
        src="/hero-image.jpg"
        alt="Jason Jewelry hero"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Elegant dark overlay with warm tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Subtle gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Decorative corner ornaments */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gold/40 opacity-60" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gold/40 opacity-60" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gold/40 opacity-60" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gold/40 opacity-60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Decorative diamond */}
        <div className="animate-fade-in-up mb-6">
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent mb-4" />
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-gold-light">
            Sejak Generasi Pertama
          </p>
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent mt-4" />
        </div>

        <h1 className="animate-fade-in-up-delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight max-w-4xl">
          Emas yang bercerita,{" "}
          <span className="italic text-shimmer-gold">
            bukan sekadar berkilau.
          </span>
        </h1>

        <p className="animate-fade-in-up-delay-2 text-white/70 mt-6 max-w-lg text-lg leading-relaxed">
          Setiap perhiasan Jason Jewelry lahir dari ketelitian dan tera kemurnian
          yang tak pernah kami kompromikan.
        </p>

        <div className="animate-fade-in-up-delay-3 flex gap-4 mt-10">
          <Link
            href="/produk"
            className="group relative rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-gold-glow hover:scale-[1.02]"
          >
            <span className="relative z-10">Jelajahi Koleksi</span>
          </Link>
          <a
            href="#journey"
            className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white/90 transition-all duration-300 hover:border-gold/60 hover:text-gold-light hover:bg-white/5"
          >
            Kisah Kami
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="h-8 w-px bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}