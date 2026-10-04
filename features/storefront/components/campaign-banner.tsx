import Link from "next/link";
import { Gem, ArrowRight, Shield, Star, Award } from "lucide-react";

const features = [
  {
    icon: <Shield className="size-5 text-gold" />,
    title: "Tera Resmi Terjamin",
    desc: "Setiap perhiasan memiliki sertifikasi karat resmi yang transparan dan dapat diverifikasi.",
  },
  {
    icon: <Star className="size-5 text-gold" />,
    title: "Kualitas Premium",
    desc: "Pilihan 18K, 22K, dan 24K dengan standar kemurnian ketat dari pemasok terpercaya.",
  },
  {
    icon: <Award className="size-5 text-gold" />,
    title: "Pelayanan Terbaik",
    desc: "Lebih dari 10 tahun melayani pelanggan dengan kejujuran dan profesionalisme.",
  },
];

export function CampaignBanner() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Main banner card */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-gold/30 shadow-sm hover:shadow-gold-glow transition-all duration-500">
          {/* Subtle gold accent aura */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gold/8 blur-3xl pointer-events-none" />

          {/* Decorative corners */}
          <div className="absolute top-6 right-6 w-14 h-14 border-t-2 border-r-2 border-gold/30" />
          <div className="absolute bottom-6 left-6 w-14 h-14 border-b-2 border-l-2 border-gold/30" />

          <div className="relative grid lg:grid-cols-2 gap-0">
            {/* Left content */}
            <div className="p-10 sm:p-14 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-4 py-1.5 mb-6 w-fit">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
                  Kampanye #TeraJason
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
                Setiap tera adalah janji,{" "}
                <span className="italic text-shimmer-gold">bukan sekadar tanda.</span>
              </h2>

              <p className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]">
                Kami percaya kepercayaan dibangun dari transparansi — karat, berat, dan kondisi setiap barang selalu tercatat jelas untuk Anda.
              </p>

              <Link
                href="/produk"
                className="inline-flex items-center gap-2.5 mt-10 w-fit rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-gold-glow hover:scale-[1.02] group"
              >
                Lihat Koleksi
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Right visual */}
            <div className="relative min-h-[300px] lg:min-h-0 flex items-center justify-center p-10 bg-gradient-to-br from-gold/5 via-white to-transparent border-t lg:border-t-0 lg:border-l border-gold/15">
              <div className="relative text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-gold/10 mx-auto mb-4 border border-gold/20 shadow-sm">
                  <Gem className="size-10 text-gold" strokeWidth={1.2} />
                </div>
                <span className="block text-[84px] font-bold text-gold/20 leading-none tracking-wider select-none">
                  24K
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.4em] text-gold font-semibold mt-3 block">
                  Pure Gold · Certified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards below */}
        <div className="grid sm:grid-cols-3 gap-5 mt-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-white p-7 hover:border-gold/30 hover:shadow-gold-glow transition-all duration-300"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-gold/10 mb-5 group-hover:bg-gold/15 transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}