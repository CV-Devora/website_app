import { OverviewCards } from "@/features/dashboard/components/overview-cards";
import { OverviewChart } from "@/features/dashboard/components/overview-chart";
import { RecentOrders } from "@/features/dashboard/components/recent-orders";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your jewelry store performance.
        </p>
      </div>
      <OverviewCards />
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <OverviewChart />
        </div>
        <div className="lg:col-span-3">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
