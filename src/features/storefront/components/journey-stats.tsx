const stats = [
  { value: "24K", label: "Karat Kemurnian Tertinggi" },
  { value: "10+", label: "Tahun Melayani Pelanggan" },
  { value: "5", label: "Cabang Toko" },
  { value: "1000+", label: "Perhiasan Terjual" },
];

export function JourneyStats() {
  return (
    <section id="journey" className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald mb-3">
          Perjalanan Kami
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
          Dibangun dari kepercayaan, dijaga dengan ketelitian.
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-4xl sm:text-5xl font-semibold text-emerald">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}