import type { Metadata } from "next";
import { CustomerDashboardShell } from "./customer-dashboard-shell";

export const metadata: Metadata = {
  title: "Customer Dashboard | Evently",
  description: "Customer dashboard overview for Evently customers.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <CustomerDashboardShell>{children}</CustomerDashboardShell>
    </div>
  );
}
