import { Topbar } from "@/features/storefront/components/topbar";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { FooterFull } from "@/features/storefront/components/footer-full";
import { Gem, Heart, Shield, Users, MapPin, Award, Star } from "lucide-react";

const values = [
  {
    icon: <Shield className="size-6 text-gold" />,
    title: "Integritas",
    desc: "Kami tidak pernah berkompromi soal kejujuran. Setiap karat, setiap gram — tertera jelas dan bisa diverifikasi.",
  },
  {
    icon: <Heart className="size-6 text-gold" />,
    title: "Keikhlasan",
    desc: "Melayani dengan sepenuh hati, karena kami percaya bahwa kepercayaan pelanggan adalah aset terbesar kami.",
  },
  {
    icon: <Star className="size-6 text-gold" />,
    title: "Kualitas",
    desc: "Setiap perhiasan yang kami jual melalui seleksi ketat untuk memastikan kemurnian dan keindahannya terjaga.",
  },
  {
    icon: <Users className="size-6 text-gold" />,
    title: "Komunitas",
    desc: "Kami hadir bukan hanya sebagai toko, tapi sebagai mitra yang tumbuh bersama komunitas Toba.",
  },
];

const milestones = [
  { year: "2014", title: "Berdiri di Balige", desc: "Jason Jewelry pertama kali membuka toko di Balige, Toba, dengan modal kepercayaan dan tekad kuat." },
  { year: "2017", title: "Ekspansi ke Medan", desc: "Seiring kepercayaan pelanggan yang semakin besar, kami membuka cabang di Kota Medan." },
  { year: "2020", title: "Digitalisasi Sistem", desc: "Kami bertransformasi digital untuk memudahkan pelanggan mengakses katalog dan informasi produk secara online." },
  { year: "2024", title: "10 Tahun Bersama Anda", desc: "Merayakan satu dekade melayani lebih dari ribuan pelanggan di seluruh Sumatera Utara." },
];

export default function TentangPage() {
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
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Tentang Kami</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight max-w-3xl">
            Satu dekade membangun{" "}
            <span className="italic text-shimmer-gold">kepercayaan.</span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl leading-relaxed text-lg">
            Jason Jewelry bukan hanya toko perhiasan. Kami adalah mitra yang hadir di setiap momen berharga kehidupan Anda — dari pernikahan hingga investasi generasi.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-muted border border-border">
              <img
                src="/journey-image.jpg"
                alt="Jason Jewelry story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-background/90 backdrop-blur-md rounded-2xl p-5 border border-border/60 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gold/10">
                      <Award className="size-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Terpercaya Sejak 2014</p>
                      <p className="text-xs text-muted-foreground">Melayani ribuan pelanggan di Sumatera Utara</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Kisah Kami</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-snug mb-6">
                Bermula dari satu toko kecil di Balige
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Jason Jewelry berdiri pada tahun 2014 di jantung kota Balige, Toba, Sumatera Utara. Bermula dari impian sederhana: menyediakan perhiasan emas berkualitas tinggi yang dapat dipercaya oleh masyarakat setempat.
                </p>
                <p>
                  Selama lebih dari satu dekade, kami telah melayani ribuan pelanggan dengan prinsip utama — transparansi. Setiap perhiasan yang kami jual memiliki keterangan karat, berat, dan kondisi yang jelas dan dapat diverifikasi.
                </p>
                <p>
                  Kini, dengan tiga cabang di Sumatera Utara, Jason Jewelry terus tumbuh bersama kepercayaan Anda. Kami tidak hanya menjual emas — kami menjaga warisan yang akan Anda berikan kepada generasi berikutnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Nilai Kami</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
              Prinsip yang kami pegang teguh
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-border bg-card p-8 hover:border-gold/30 hover:shadow-gold-glow transition-all duration-300"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-gold/8 mb-6 group-hover:bg-gold/12 transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Perjalanan</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
              10 tahun bersama Anda
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/20 to-transparent hidden md:block" />

            <div className="space-y-10">
              {milestones.map((m, idx) => (
                <div
                  key={m.year}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${idx % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="rounded-2xl border border-border bg-card p-7 hover:border-gold/25 hover:shadow-gold-glow transition-all duration-300">
                      <p className="font-mono text-xs uppercase tracking-wider text-gold mb-2">{m.year}</p>
                      <h3 className="font-semibold text-foreground mb-2">{m.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex shrink-0 size-10 items-center justify-center rounded-full bg-card border-2 border-gold/40 z-10">
                    <div className="size-3 rounded-full bg-gradient-to-br from-gold-dark to-gold" />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-foreground py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 80% at 50% 50%, oklch(0.72 0.14 75 / 0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Gem className="size-12 text-gold/30 mx-auto mb-6" strokeWidth={0.8} />
          <h2 className="text-3xl font-semibold text-background mb-4">
            Siap memilih perhiasan Anda?
          </h2>
          <p className="text-background/50 mb-8 leading-relaxed">
            Kunjungi toko kami atau jelajahi koleksi online. Kami siap membantu Anda menemukan perhiasan yang sempurna.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/produk"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 py-4 text-sm font-semibold text-white hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-300"
            >
              Lihat Koleksi
            </a>
            <a
              href="/kontak"
              className="inline-flex items-center gap-2 rounded-full border border-background/20 px-8 py-4 text-sm font-medium text-background/80 hover:border-gold/30 hover:text-gold transition-all duration-300"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      <FooterFull />
    </div>
  );
}
