"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const COLORS = [
  "oklch(0.55 0.2 255)",
  "oklch(0.65 0.15 235)",
  "oklch(0.72 0.12 215)",
  "oklch(0.78 0.09 200)",
  "oklch(0.82 0.06 190)",
];

interface GoldDistributionProps {
  data: { label: string; value: number }[];
  loading: boolean;
}

export function GoldDistribution({ data, loading }: GoldDistributionProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Karat Barang</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.length
    ? data.map((d) => ({ name: `${d.label}K`, value: d.value }))
    : [{ name: "No data", value: 1 }];

  return (
    <Card className="overflow-hidden min-w-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Distribusi Kadar Emas</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Komposisi stok barang berdasarkan kadar karat</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 px-2 sm:px-4">
        <div className="w-full h-[240px] sm:h-[270px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => [v, "unit"]}
                contentStyle={{
                  background: "white",
                  border: "1px solid oklch(0.9 0.02 240)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: "11px", color: "oklch(0.45 0.02 240)" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
