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
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald mb-3">
          Kunjungi Kami
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
          Toko Kami di Sekitar Anda
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store.name} className="rounded-lg border border-border p-6">
            <h3 className="font-semibold text-foreground">{store.name}</h3>
            <p className="flex items-start gap-2 text-sm text-muted-foreground mt-3">
              <MapPin className="size-4 shrink-0 mt-0.5" />
              {store.address}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Phone className="size-4 shrink-0" />
              {store.phone}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}