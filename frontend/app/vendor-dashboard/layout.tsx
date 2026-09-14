import type { Metadata } from "next";
import { VendorDashboardShell } from "./vendor-dashboard-shell";

export const metadata: Metadata = {
  title: "Vendor Dashboard | Evently",
  description: "Vendor dashboard overview for Evently vendors.",
};

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <VendorDashboardShell>{children}</VendorDashboardShell>
    </div>
  );
}
