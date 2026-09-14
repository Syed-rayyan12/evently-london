import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { CustomerDashboardShell } from "./customer-dashboard-shell";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <div className={playfairDisplay.variable}>
      <CustomerDashboardShell>{children}</CustomerDashboardShell>
    </div>
  );
}
