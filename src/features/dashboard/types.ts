export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  date: string;
}
