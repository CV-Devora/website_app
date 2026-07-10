"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: sambungkan ke endpoint newsletter jika backend sudah menyediakannya
    setSubmitted(true);
  };

  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Jadi yang pertama tahu koleksi terbaru
        </h2>
        <p className="text-muted-foreground mt-2">
          Daftar untuk mendapatkan info promo dan koleksi eksklusif dari Jason Jewelry.
        </p>

        {submitted ? (
          <p className="text-emerald font-medium mt-6">Terima kasih! Anda telah terdaftar.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat email Anda"
              required
              className="flex-1"
            />
            <Button type="submit" className="bg-emerald text-white hover:opacity-90">
              Daftar
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}