import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

const stores = [
  {
    name: "Jason Jewelry",
    address: " Pasar Minggu Blok E Lt. L00 Bks No. 7, 8, 9 (Pintu Masuk Utama), Jakarta Selatan 12510",
    hours: "Senin–Sabtu: 08.30–17.30",
    featured: true,
  },
  {
    name: "Jason Jewelry ",
    address: "Pasar Minggu Blok E No. 41, 42, 43 (Samping Eskalator), Jakarta Selatan 12510",
    hours: "Senin–Sabtu: 08.30–17.30",
    featured: false,
  },
];

export function StoreLocations() {
  return (
    <section className="py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">
              Kunjungi Kami
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
            Toko Kami di Sekitar Anda
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
            Kunjungi toko terdekat kami dan konsultasikan kebutuhan perhiasan Anda secara langsung.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {stores.map((store) => (
            <div
              key={store.name}
              className={`group relative rounded-2xl border bg-card p-5 sm:p-7 transition-all duration-300 hover:shadow-gold-glow ${
                store.featured
                  ? "border-gold/30 shadow-gold-glow"
                  : "border-border hover:border-gold/25"
              }`}
            >
              {store.featured && (
                <div className="absolute -top-2.5 left-6">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-gold-dark to-gold text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Toko Utama
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3 mb-5 mt-1">
                <div className={`flex size-11 items-center justify-center rounded-xl shrink-0 transition-colors duration-300 ${
                  store.featured ? "bg-gold/15 group-hover:bg-gold/20" : "bg-muted group-hover:bg-gold/10"
                }`}>
                  <MapPin className={`size-5 ${store.featured ? "text-gold" : "text-muted-foreground group-hover:text-gold"} transition-colors duration-300`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground leading-tight">{store.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{store.address}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5 text-gold/50 shrink-0" />
                  <span>{store.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}