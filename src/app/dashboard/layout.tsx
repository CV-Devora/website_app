import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { ContentShell } from "@/components/layout/content-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative">
        <Sidebar />
        <ContentShell>{children}</ContentShell>
      </div>
    </SidebarProvider>
  );
}
