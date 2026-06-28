import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="Manage your jewelry product catalog."
      />
      <EmptyState />
    </div>
  );
}
