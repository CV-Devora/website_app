import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
      {/* Video background — ganti src di /public/hero-video.mp4 dengan video asli */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay gelap supaya teks tetap terbaca di atas video */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/80 mb-4">
          Sejak Generasi Pertama
        </p>
        <h1 className="text-4xl sm:text-6xl font-semibold text-white leading-tight max-w-3xl">
          Emas yang bercerita, <span className="italic">bukan sekadar berkilau.</span>
        </h1>
        <p className="text-white/80 mt-5 max-w-lg">
          Setiap perhiasan Jason Jewelry lahir dari ketelitian dan tera kemurnian
          yang tak pernah kami kompromikan.
        </p>
        <div className="flex gap-3 mt-8">
          <Link
            href="/produk"
            className="rounded-md bg-white px-6 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
          >
            Jelajahi Koleksi
          </Link>
          <a
            href="#journey"
            className="rounded-md border border-white/60 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Kisah Kami
          </a>
        </div>
      </div>
    </section>
  );
}