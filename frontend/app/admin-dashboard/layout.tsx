import type { Metadata } from "next";
import { AdminDashboardShell } from "./admin-dashboard-shell";

export const metadata: Metadata = {
  title: "Admin Dashboard | Evently",
  description: "Admin dashboard overview for Evently customers.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </div>
  );
}
