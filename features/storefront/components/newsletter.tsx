"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
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
        description: "Terima kasih telah mendaftar. Kami akan mengirimkan info eksklusif segera.",
        style: {
          background: "oklch(0.18 0.02 55)", // dark theme
          color: "oklch(0.95 0.01 75)", 
          border: "1px solid oklch(0.72 0.14 75 / 0.3)", // gold border
        },
      });
    }, 500);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }} />

      {/* Decorative */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-gold/20" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-gold/20" />

      <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="flex justify-center mb-5">
          <div className="flex size-10 items-center justify-center rounded-full bg-gold/15">
            <Sparkles className="size-5 text-gold" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-background">
          Jadi yang pertama tahu koleksi terbaru
        </h2>
        <p className="text-background/50 mt-3 leading-relaxed">
          Daftar untuk mendapatkan info promo dan koleksi eksklusif dari Jason Jewelry.
        </p>

        {submitted ? (
          <p className="text-gold-light font-medium mt-8 text-lg animate-fade-in-up">
            ✓ Terima kasih! Anda telah terdaftar.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat email Anda"
              required
              className="flex-1 bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-gold/50 focus:ring-gold/20"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-gold-dark via-gold to-gold-light text-white border-0 hover:opacity-90 transition-opacity rounded-lg px-6"
            >
              Daftar
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}