"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setTimeout(() => {
      setSubmitted(true);
      toast.success("Berhasil Berlangganan!", {
        description:
          "Terima kasih telah mendaftar. Kami akan mengirimkan info eksklusif segera.",
        style: {
          background: "oklch(0.18 0.02 55)",
          color: "oklch(0.95 0.01 75)",
          border: "1px solid oklch(0.72 0.14 75 / 0.3)",
        },
      });
    }, 500);
  };

  return (
    <section className="relative py-28 overflow-hidden bg-foreground">
      {/* Layered bg */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 50%, oklch(0.72 0.14 75 / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/15" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/15" />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gold/12 border border-gold/20">
            <Mail className="size-6 text-gold" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold text-background leading-snug">
          Jadi yang pertama tahu{" "}
          <span className="italic text-shimmer-gold">koleksi terbaru</span>
        </h2>
        <p className="text-background/45 mt-4 leading-relaxed max-w-sm mx-auto">
          Daftar newsletter untuk mendapatkan info promo, koleksi eksklusif, dan kabar terbaru dari Jason Jewelry.
        </p>

        {submitted ? (
          <div className="mt-10 inline-flex items-center gap-2.5 bg-gold/10 border border-gold/20 rounded-full px-6 py-3 animate-fade-in-up">
            <span className="text-gold text-lg">✓</span>
            <p className="text-gold font-medium">Terima kasih! Anda telah terdaftar.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 mt-10 max-w-md mx-auto"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan alamat email Anda"
              required
              className="flex-1 bg-white/8 border-white/15 text-background placeholder:text-background/30 focus:border-gold/40 focus:ring-gold/20 rounded-xl h-11"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-gold-dark via-gold to-gold-light text-white border-0 hover:opacity-90 hover:shadow-gold-glow transition-all duration-200 rounded-xl h-11 px-6 font-semibold shrink-0"
            >
              Daftar Sekarang
            </Button>
          </form>
        )}

        <p className="text-background/25 text-xs mt-5">
          Kami menghormati privasi Anda. Tidak ada spam, hanya info berharga.
        </p>
      </div>
    </section>
  );
}