import Link from "next/link";

export function CampaignBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-2xl bg-muted grid sm:grid-cols-2 overflow-hidden">
        <div className="p-10 sm:p-14 flex flex-col justify-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald mb-3">
            Kampanye #TeraJason
          </p>
          <h2 className="text-3xl font-semibold text-foreground leading-tight">
            Setiap tera adalah janji, bukan sekadar tanda.
          </h2>
          <p className="text-muted-foreground mt-4">
            Kami percaya kepercayaan dibangun dari transparansi — karat, berat,
            dan kondisi setiap barang selalu tercatat jelas untuk Anda.
          </p>
          <Link
            href="/produk"
            className="inline-block mt-6 w-fit rounded-md bg-emerald px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Lihat Koleksi
          </Link>
        </div>
        <div className="relative min-h-[280px] bg-gradient-to-br from-gold/30 to-emerald/20 flex items-center justify-center">
          <span className="text-8xl font-semibold text-gold/40 select-none">24K</span>
        </div>
      </div>
    </section>
  );
}