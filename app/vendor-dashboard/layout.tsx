import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { VendorDashboardShell } from "./vendor-dashboard-shell";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <div className={playfairDisplay.variable}>
      <VendorDashboardShell>{children}</VendorDashboardShell>
    </div>
  );
}
