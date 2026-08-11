import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes yang membutuhkan autentikasi
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/baki",
  "/barang",
  "/karat",
  "/pembelian",
  "/penjualan",
  "/users",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico";

  if (isPublicAsset) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(prefix + "/")
  );

  // Halaman terproteksi: redirect ke login jika belum login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login & akses halaman login: redirect ke dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)"],
};
