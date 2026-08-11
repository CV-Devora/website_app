"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gem, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.auth.login({ username, password });
      if (res.code === 200 && res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        document.cookie = `token=${res.data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        router.push("/dashboard");
      } else {
        setError("Login gagal. Periksa kembali kredensial Anda.");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ─── Left panel ─── */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-16 text-white relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -left-20 size-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 size-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-8 size-40 rounded-full bg-white/5" />

        <div className="relative z-10 max-w-md space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl">
              <img src="jason.png" alt="Jason Jewelry" className="w-22 h-16" />
            </div>
            <div>
              <p className="text-xl font-bold">Toko Emas</p>
              <p className="text-sm text-blue-200">Jason Jewelry</p>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Sistem Manajemen
              <br />
              Toko Emas
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Platform terintegrasi untuk kelola penjualan, pembelian, dan
              inventaris emas Anda secara efisien.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3 text-sm">
            {[
              "Manajemen barang & stok emas real-time",
              "Laporan penjualan & pembelian otomatis",
              "Dashboard analitik yang komprehensif",
              "Multi-user dengan kontrol akses",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-blue-100">
                <span className="size-1.5 shrink-0 rounded-full bg-blue-300" />
                {f}
              </li>
            ))}
          </ul>

          <div className="h-px bg-white/20" />
          <p className="text-xs text-blue-200">
            © 2025 Jason Jewelry. Semua hak dilindungi.
          </p>
        </div>
      </div>

      {/* ─── Right panel: form ─── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile brand */}
          <div className="flex flex-col items-center gap-2 lg:hidden">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600">
              <Gem className="size-6 text-white" />
            </div>
            <p className="text-lg font-bold text-foreground">Toko Emas</p>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">Selamat Datang</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={cn(
                  "h-11 bg-white",
                  error && "border-red-300 focus-visible:ring-red-400"
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={cn(
                    "h-11 bg-white pr-10",
                    error && "border-red-300 focus-visible:ring-red-400"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Hubungi administrator jika lupa password Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
