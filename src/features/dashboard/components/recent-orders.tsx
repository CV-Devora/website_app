import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/features/dashboard/types";

const recentOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Alice Johnson",
    email: "alice@example.com",
    status: "delivered",
    total: 1250.0,
    date: "2026-06-25",
  },
  {
    id: "ORD-002",
    customer: "Bob Smith",
    email: "bob@example.com",
    status: "processing",
    total: 3400.0,
    date: "2026-06-26",
  },
  {
    id: "ORD-003",
    customer: "Carol White",
    email: "carol@example.com",
    status: "shipped",
    total: 875.5,
    date: "2026-06-26",
  },
  {
    id: "ORD-004",
    customer: "David Lee",
    email: "david@example.com",
    status: "pending",
    total: 2200.0,
    date: "2026-06-27",
  },
  {
    id: "ORD-005",
    customer: "Eve Davis",
    email: "eve@example.com",
    status: "cancelled",
    total: 1500.0,
    date: "2026-06-27",
  },
];

const statusVariant: Record<
  Order["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  processing: "secondary",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{order.customer}</span>
                    <span className="text-xs text-muted-foreground">
                      {order.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${order.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
