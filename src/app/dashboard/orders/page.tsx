import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        description="Manage customer orders and track shipments."
      />
      <EmptyState />
    </div>
  );
}
