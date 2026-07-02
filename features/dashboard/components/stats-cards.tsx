"use client";

import { DollarSign, ShoppingBag, ShoppingCart, Gem, TrendingUp, TrendingDown } from "lucide-react";
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
  change,
  icon: Icon,
  trend,
  color,
  loading,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: "up" | "down";
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
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            <div className="flex items-center gap-1 text-xs">
              {trend === "up" ? (
                <TrendingUp className="size-3 text-green-500" />
              ) : (
                <TrendingDown className="size-3 text-red-500" />
              )}
              <span className={trend === "up" ? "text-green-600" : "text-red-500"}>
                {change}
              </span>
            </div>
          </div>
          <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", color)}>
            <Icon className="size-6 text-white" />
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
      label: "Total Penjualan",
      value: formatRupiah(totalPenjualan),
      change: "+12.5% bulan ini",
      icon: DollarSign,
      trend: "up" as const,
      color: "bg-blue-500",
    },
    {
      label: "Total Pembelian",
      value: formatRupiah(totalPembelian),
      change: "+8.2% bulan ini",
      icon: ShoppingCart,
      trend: "up" as const,
      color: "bg-indigo-500",
    },
    {
      label: "Transaksi Penjualan",
      value: String(data?.penjualan_chart?.length ?? 0),
      change: "+4.1% bulan ini",
      icon: ShoppingBag,
      trend: "up" as const,
      color: "bg-violet-500",
    },
    {
      label: "Total Barang",
      value: String(totalBarang),
      change: "+2.3% bulan ini",
      icon: Gem,
      trend: "up" as const,
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} loading={loading} />
      ))}
    </div>
  );
}
