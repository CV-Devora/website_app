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
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Kadar Emas</CardTitle>
        <CardDescription>Komposisi stok barang berdasarkan kadar karat</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
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
              formatter={(v: number) => [v, "unit"]}
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
                <span style={{ fontSize: "12px", color: "oklch(0.45 0.02 240)" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
