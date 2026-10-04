import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden flex items-end">
      {/* Background image */}
      <img
        src="/images.jpg"
        alt="Jason Jewelry hero"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-black/20" />
      
      {/* Decorative corner frames */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-gold/30 opacity-70" />
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-gold/30 opacity-70" />

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
          <div className="max-w-3xl">

            {/* Headline */}
            <h1 className="animate-fade-in-up-delay-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[1.05] tracking-tight">
              Emas yang{" "}
              <span className="block italic text-shimmer-gold">bercerita.</span>
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-in-up-delay-2 text-white mt-6 max-w-md text-lg leading-relaxed font-light">
              Setiap perhiasan Jason Jewelry lahir untuk Anda dan generasi berikutnya
            </p>

            {/* CTA row */}
            <div className="animate-fade-in-up-delay-3 flex flex-wrap gap-4 mt-10">
              <Link
                href="/produk"
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-300"
              >
                <span>Jelajahi Koleksi</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-in-up-delay-3 flex flex-wrap items-center gap-6 mt-12">
              {[
                { label: "Kemurnian 24K", sub: "Terjamin Kualitasnya" },
                { label: "10+ Tahun", sub: "Melayani Pelanggan" },
                { label: "1000+", sub: "Perhiasan Terjual" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2">
                  <div className="h-6 w-px bg-gold/30" />
                  <div>
                    <p className="text-sm font-semibold text-white">{badge.label}</p>
                    <p className="text-xs text-white/50 font-light">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}