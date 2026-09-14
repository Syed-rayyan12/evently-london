import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { AdminDashboardShell } from "./admin-dashboard-shell";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <div className={playfairDisplay.variable}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </div>
  );
}
