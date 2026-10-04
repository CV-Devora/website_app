import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/features/storefront/components/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jason Jewelry — Perhiasan Emas Terpercaya",
  description:
    "Perhiasan emas premium dengan kemurnian terjamin dan tera resmi. Melayani sejak 2014 di Toba, Sumatera Utara.",
  keywords: ["toko emas", "perhiasan emas", "jewelry", "karat", "Balige", "Toba", "Sumatera Utara"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ScrollToTop />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
