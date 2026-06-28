import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Gem, Users } from "lucide-react";

const stats = [
  {
    label: "Total Revenue",
    value: "$45,231",
    change: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    label: "Orders",
    value: "356",
    change: "+12.5% from last month",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    value: "1,245",
    change: "+3.2% from last month",
    icon: Gem,
  },
  {
    label: "Active Customers",
    value: "892",
    change: "+8.1% from last month",
    icon: Users,
  },
];

export function OverviewCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2">
              <stat.icon className="size-4 text-primary" aria-hidden />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
