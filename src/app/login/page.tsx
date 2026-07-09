"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HallmarkStamp } from "@/components/shared/hallmark-stamp";
import { User, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.auth.login({ username, password });
      const { access_token, refresh_token, user } = res.data;

      localStorage.setItem("token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Panel brand — disembunyikan di layar kecil */}
      <div className="hidden lg:flex flex-col justify-between bg-emerald p-12 text-white relative overflow-hidden">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors w-fit">
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>

        <div className="flex flex-col items-center gap-8">
          <div className="w-48">
            <HallmarkStamp strokeColor="#ffffff" textColor="#ffffff" labelColor="#ffffff" />
          </div>
          <div className="text-center max-w-sm">
            <h2 className="text-2xl font-semibold italic">Jason Jewelry</h2>
            <p className="text-white/70 mt-3 text-sm leading-relaxed">
              Setiap barang tercatat rapi — karat, berat, dan riwayatnya —
              supaya pengelolaan katalog Anda setransparan tera emasnya.
            </p>
          </div>
        </div>

        <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
          Panel Admin &amp; Staf
        </p>
      </div>

      {/* Panel form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-20">
              <HallmarkStamp />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-foreground">Selamat datang kembali</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Masuk dengan kredensial admin atau staf Anda.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="budi"
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Masuk
            </Button>
          </form>

          <Link
            href="/"
            className="lg:hidden block text-center text-sm text-muted-foreground hover:text-foreground mt-6"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}