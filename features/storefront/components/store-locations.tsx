import { MapPin, Phone } from "lucide-react";

const stores = [
  {
    name: "Jason Jewelry — Balige",
    address: "Jl. Sisingamangaraja, Balige, Toba, Sumatera Utara",
    phone: "+62 812-3456-789",
  },
  {
    name: "Jason Jewelry — Medan",
    address: "Jl. Ahmad Yani, Medan, Sumatera Utara",
    phone: "+62 813-4567-890",
  },
  {
    name: "Jason Jewelry — Pematangsiantar",
    address: "Jl. Sutomo, Pematangsiantar, Sumatera Utara",
    phone: "+62 814-5678-901",
  },
];

export function StoreLocations() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="mx-auto h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-4">
          Kunjungi Kami
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
          Toko Kami di Sekitar Anda
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store.name}
            className="group rounded-xl border border-border p-7 bg-card transition-all duration-300 hover:border-gold/40 hover:shadow-gold-glow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold/20">
                <MapPin className="size-4" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{store.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {store.address}
            </p>
            <div className="h-px w-full bg-border my-4" />
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-3.5 text-gold/60" />
              {store.phone}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}