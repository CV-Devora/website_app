"use client";

import { DollarSign, ShoppingBag, ShoppingCart, Gem } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartData {
  label: string;
  value: number;
}

interface StatsCardsProps {
  data: {
    penjualan_chart?: ChartData[];
    pembelian_chart?: ChartData[];
    barang_chart?: ChartData[];
  } | null;
  loading: boolean;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate" title={label}>{label}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground truncate" title={value}>
              {value}
            </p>           
          </div>
          <div className={cn("flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl", color)}>
            <Icon className="size-5 sm:size-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards({ data, loading }: StatsCardsProps) {
  const totalPenjualan = data?.penjualan_chart?.reduce((s, d) => s + d.value, 0) ?? 0;
  const totalPembelian = data?.pembelian_chart?.reduce((s, d) => s + d.value, 0) ?? 0;
  const totalBarang = data?.barang_chart?.reduce((s, d) => s + d.value, 0) ?? 0;

  const formatRupiah = (v: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(v);

  const stats = [
    {
      label: "Total Omzet Penjualan",
      value: formatRupiah(totalPenjualan),
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      label: "Total Nilai Pembelian",
      value: formatRupiah(totalPembelian),
      icon: ShoppingCart,
      color: "bg-indigo-500",
    },
    {
      label: "Jumlah Transaksi Penjualan",
      value: String(data?.penjualan_chart?.length ?? 0),
      icon: ShoppingBag,
      color: "bg-violet-500",
    },
    {
      label: "Total Stok Barang",
      value: String(totalBarang),
      icon: Gem,
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} loading={loading} />
      ))}
    </div>
  );
}
