import Link from "next/link";
import { Gem } from "lucide-react";

export function CampaignBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative rounded-2xl overflow-hidden border border-gold/20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90" />

        {/* Decorative elements */}
        <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-gold/30" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-gold/30" />

        <div className="relative grid sm:grid-cols-2 gap-0">
          <div className="p-10 sm:p-14 flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-4">
              Kampanye #TeraJason
            </p>
            <h2 className="text-3xl font-semibold text-background leading-tight">
              Setiap tera adalah janji,{" "}
              <span className="italic text-gold-light">bukan sekadar tanda.</span>
            </h2>
            <p className="text-background/60 mt-4 leading-relaxed">
              Kami percaya kepercayaan dibangun dari transparansi — karat, berat,
              dan kondisi setiap barang selalu tercatat jelas untuk Anda.
            </p>
            <Link
              href="/produk"
              className="inline-block mt-8 w-fit rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-gold-glow hover:scale-[1.02]"
            >
              Lihat Koleksi
            </Link>
          </div>
          <div className="relative min-h-[280px] flex items-center justify-center">
            {/* Radial glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent" />
            <div className="relative flex flex-col items-center gap-3">
              <Gem className="size-12 text-gold/60" strokeWidth={0.8} />
              <span className="text-8xl font-semibold text-gold/20 select-none tracking-wider">
                24K
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold/40">
                Pure Gold
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}