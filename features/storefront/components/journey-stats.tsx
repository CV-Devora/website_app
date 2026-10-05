const stats = [
  { value: "10+", label: "Tahun Pengalaman", sub: "Melayani pelanggan sejak 2012" },
  { value: "24K", label: "Kemurnian Tertinggi", sub: "Emas murni bersertifikasi resmi" },
  { value: "2", label: "Cabang Toko", sub: "Tersebar di Jakarta" },
  { value: "1000+", label: "Perhiasan Terjual", sub: "Pelanggan puas dari seluruh daerah" },
];

export function JourneyStats() {
  return (
    <section id="journey" className="relative py-16 sm:py-28 overflow-hidden border-y border-border/60">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section label */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">
              Perjalanan Kami
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-snug">
            Dibangun dari kepercayaan,
            <br />
            <span className="italic text-gold">dijaga dengan ketelitian.</span>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="group relative rounded-2xl border border-border bg-card p-5 sm:p-8 text-center hover:border-gold/35 hover:shadow-gold-glow transition-all duration-300"
            >
              {/* Number */}
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-shimmer-gold mb-3">
                {stat.value}
              </p>
              {/* Label */}
              <p className="font-semibold text-foreground text-sm mb-1.5">
                {stat.label}
              </p>
              {/* Sub */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {stat.sub}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-gradient-to-r from-gold-dark to-gold-light transition-all duration-500 group-hover:w-12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}