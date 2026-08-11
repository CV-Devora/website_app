const stats = [
  { value: "24K", label: "Karat Kemurnian Tertinggi" },
  { value: "10+", label: "Tahun Melayani Pelanggan" },
  { value: "5", label: "Cabang Toko" },
  { value: "1000+", label: "Perhiasan Terjual" },
];

export function JourneyStats() {
  return (
    <section id="journey" className="relative py-24 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="mx-auto h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-4">
            Perjalanan Kami
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-snug">
            Dibangun dari kepercayaan, dijaga dengan ketelitian.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group text-center p-8 rounded-2xl border border-border bg-card transition-all duration-300 hover:border-gold/40 hover:shadow-gold-glow"
            >
              <p className="text-4xl sm:text-5xl font-semibold text-shimmer-gold">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}