import { Topbar } from "@/features/storefront/components/topbar";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { FooterFull } from "@/features/storefront/components/footer-full";
import { ShoppingBag, TrendingUp, Shield, Gem, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: "penjualan",
    icon: <ShoppingBag className="size-7 text-gold" />,
    title: "Penjualan Perhiasan",
    tagline: "Temukan perhiasan impian Anda",
    desc: "Kami menyediakan berbagai koleksi perhiasan emas mulai dari cincin, kalung, gelang, anting, hingga perhiasan custom dengan berbagai pilihan karat (18K, 22K, 24K) dan kondisi (baru dan bekas berkualitas).",
    features: [
      "Pilihan karat: 18K, 22K, 24K",
      "Perhiasan baru dan bekas berkualitas",
      "Sertifikasi karat resmi",
      "Harga transparan tanpa hidden cost",
      "Garansi keaslian produk",
    ],
    cta: { label: "Lihat Koleksi", href: "/produk" },
  },
  {
    id: "pembelian",
    icon: <TrendingUp className="size-7 text-gold" />,
    title: "Pembelian Emas",
    tagline: "Kami beli emas Anda dengan harga terbaik",
    desc: "Ingin menjual perhiasan atau emas batangan Anda? Kami menawarkan harga pembelian kompetitif berdasarkan harga emas terkini. Proses cepat, transparan, dan terpercaya.",
    features: [
      "Harga mengikuti kurs emas harian",
      "Proses cepat & transparan",
      "Penilaian karat gratis",
      "Pembayaran tunai langsung",
      "Penimbangan di depan pelanggan",
    ],
    cta: { label: "Hubungi Kami", href: "/kontak" },
  },
  {
    id: "sertifikasi",
    icon: <Shield className="size-7 text-gold" />,
    title: "Sertifikasi Karat",
    tagline: "Verifikasi kemurnian emas Anda",
    desc: "Tidak yakin dengan kadar emas Anda? Kami menyediakan layanan uji karat menggunakan alat tera resmi untuk memastikan kemurnian setiap perhiasan yang Anda miliki.",
    features: [
      "Pengujian dengan alat tera resmi",
      "Hasil akurat dan terpercaya",
      "Sertifikat karat resmi",
      "Konsultasi gratis",
      "Proses cepat di tempat",
    ],
    cta: { label: "Jadwalkan Konsultasi", href: "/kontak" },
  },
];

const whyUs = [
  { title: "Tera Resmi", desc: "Setiap perhiasan tersertifikasi dengan alat tera resmi yang terpercaya." },
  { title: "Harga Transparan", desc: "Tidak ada biaya tersembunyi. Semua harga tercantum jelas." },
  { title: "10+ Tahun Berpengalaman", desc: "Lebih dari satu dekade melayani pelanggan dengan kejujuran." },
  { title: "Garansi Keaslian", desc: "Kami memberikan jaminan keaslian untuk setiap produk yang kami jual." },
  { title: "Layanan Personal", desc: "Tim kami siap memberikan konsultasi personal sesuai kebutuhan Anda." },
  { title: "Jaringan Luas", desc: "Tiga cabang di Sumatera Utara siap melayani Anda." },
];

export default function LayananPage() {
  return (
    <div className="theme-storefront min-h-screen bg-background text-foreground flex flex-col">
      <StorefrontHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-background to-background" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Layanan</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight max-w-3xl">
            Layanan lengkap untuk{" "}
            <span className="italic text-shimmer-gold">semua kebutuhan emas</span>{" "}
            Anda.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl leading-relaxed text-lg">
            Dari penjualan, pembelian, hingga sertifikasi karat — semua tersedia di bawah satu atap dengan standar kualitas dan transparansi yang kami jaga.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 space-y-10">
          {services.map((service, idx) => (
            <div
              key={service.id}
              id={service.id}
              className={`group relative rounded-3xl border border-border bg-card overflow-hidden hover:border-gold/25 hover:shadow-gold-glow transition-all duration-300 grid lg:grid-cols-2 ${
                idx % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Content side */}
              <div className={`p-10 sm:p-14 flex flex-col justify-center ${idx % 2 === 1 ? "lg:col-start-2" : ""}`}>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gold/8 mb-6 group-hover:bg-gold/12 transition-colors duration-300">
                  {service.icon}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                  {service.tagline}
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                  {service.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {service.desc}
                </p>

                {/* Feature list */}
                <ul className="space-y-2.5 mb-8">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle className="size-4 text-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.cta.href}
                  className="inline-flex items-center gap-2 w-fit rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-7 py-3.5 text-sm font-semibold text-white hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-300 group/btn"
                >
                  {service.cta.label}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </Link>
              </div>

              {/* Visual side */}
              <div className={`relative min-h-[280px] lg:min-h-0 flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20 border-t lg:border-t-0 ${
                idx % 2 === 1 ? "lg:border-r lg:col-start-1" : "lg:border-l"
              } border-border/60`}>
                <div className="flex flex-col items-center gap-4 opacity-30">
                  <div className="text-[120px] leading-none text-foreground select-none font-bold">
                    {idx === 0 ? "🏆" : idx === 1 ? "💰" : "🔬"}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gold/4 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    {service.icon && (
                      <div className="flex justify-center mb-4">
                        <div className="size-24 rounded-full bg-gold/8 flex items-center justify-center">
                          <div className="size-16 rounded-full bg-gold/12 flex items-center justify-center">
                            {service.icon}
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/40">
                      {service.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 bg-muted/30 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Keunggulan Kami</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
              Mengapa memilih Jason Jewelry?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-border bg-card p-7 hover:border-gold/25 hover:shadow-gold-glow transition-all duration-300"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <CheckCircle className="size-5 text-gold shrink-0" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterFull />
    </div>
  );
}
