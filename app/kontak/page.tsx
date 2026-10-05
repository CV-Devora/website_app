"use client";

import { useState } from "react";
import { Topbar } from "@/features/storefront/components/topbar";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { FooterFull } from "@/features/storefront/components/footer-full";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle } from "lucide-react";
import { SiInstagram, SiWhatsapp } from "@icons-pack/react-simple-icons";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: <Phone className="size-5 text-gold" />,
    title: "Telepon",
    value: "+62 812-3456-789",
    href: "tel:+628123456789",
    sub: "Senin–Sabtu, 08.00–17.00",
  },
  {
    icon: <MessageCircle className="size-5 text-gold" />,
    title: "WhatsApp",
    value: "+62 812-3456-789",
    href: "https://wa.me/628123456789",
    sub: "Respons cepat, 07.00–20.00",
  },
  {
    icon: <Mail className="size-5 text-gold" />,
    title: "Email",
    value: "hello@jasonjewelry.id",
    href: "mailto:hello@jasonjewelry.id",
    sub: "Kami balas dalam 1×24 jam",
  },
  {
    icon: <MapPin className="size-5 text-gold" />,
    title: "Alamat Utama",
    value: "Jl. Sisingamangaraja, Balige",
    href: "https://maps.google.com",
    sub: "Toba, Sumatera Utara",
  },
];

export default function KontakPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Pesan Terkirim!", {
        description: "Kami akan menghubungi Anda segera. Terima kasih!",
        style: {
          background: "oklch(0.18 0.02 55)",
          color: "oklch(0.95 0.01 75)",
          border: "1px solid oklch(0.72 0.14 75 / 0.3)",
        },
      });
    }, 1200);
  };

  const inputClass =
    "w-full h-11 px-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all duration-200";

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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 lg:py-28">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Kontak</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight max-w-2xl">
            Kami siap{" "}
            <span className="italic text-shimmer-gold">membantu Anda.</span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl leading-relaxed text-lg">
            Punya pertanyaan tentang produk, harga, atau layanan kami? Jangan ragu untuk menghubungi kami melalui saluran yang tersedia.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 sm:gap-12 w-full items-start">
            {/* Left: contact info */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-8">Informasi Kontak</h2>

              <div className="space-y-4 mb-10">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:border-gold/30 hover:shadow-gold-glow transition-all duration-300"
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-gold/8 shrink-0 group-hover:bg-gold/12 transition-colors duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                        {info.title}
                      </p>
                      <p className="font-semibold text-foreground group-hover:text-gold transition-colors duration-200">
                        {info.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{info.sub}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
                  Ikuti Kami
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:border-gold/30 hover:text-gold hover:bg-gold/5 transition-all duration-200"
                  >
                    <SiInstagram size={16} />
                    <span>@jasonjewelry.id</span>
                  </a>
                  <a
                    href="https://wa.me/628123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:border-gold/30 hover:text-gold hover:bg-gold/5 transition-all duration-200"
                  >
                    <SiWhatsapp size={16} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="rounded-2xl border border-border bg-card p-6 mt-4">
                <div className="flex items-center gap-2.5 mb-4">
                  <Clock className="size-4 text-gold" />
                  <p className="font-semibold text-foreground text-sm">Jam Operasional</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Senin – Jumat</span>
                    <span className="font-medium text-foreground">08.00 – 17.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sabtu</span>
                    <span className="font-medium text-foreground">08.00 – 15.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minggu & Libur</span>
                    <span className="text-muted-foreground/70">Tutup</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 lg:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
                    <CheckCircle className="size-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Pesan Terkirim!</h3>
                  <p className="text-muted-foreground max-w-sm leading-relaxed">
                    Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda dalam 1×24 jam.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                    className="mt-2 rounded-full border border-gold/30 px-6 py-2.5 text-sm text-gold hover:bg-gold/5 transition-all duration-200"
                  >
                    Kirim Pesan Lagi
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Kirim Pesan</h2>
                  <p className="text-sm text-muted-foreground mb-8">
                    Isi formulir di bawah ini dan kami akan menghubungi Anda segera.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                          Nama Lengkap <span className="text-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Masukkan nama Anda"
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                          No. Telepon
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+62 xxx-xxxx-xxxx"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Email <span className="text-gold">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Topik
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="">Pilih topik...</option>
                        <option value="pembelian">Informasi Pembelian</option>
                        <option value="penjualan">Jual Emas</option>
                        <option value="sertifikasi">Sertifikasi Karat</option>
                        <option value="kerjasama">Kerjasama Bisnis</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Pesan <span className="text-gold">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Ceritakan kebutuhan Anda..."
                        required
                        className={`${inputClass} h-auto resize-none py-3`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light py-3.5 text-sm font-semibold text-white hover:shadow-gold-glow hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading ? (
                        <>
                          <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="size-4" />
                          Kirim Pesan
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <FooterFull />
    </div>
  );
}
