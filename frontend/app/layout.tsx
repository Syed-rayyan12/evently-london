import type { Metadata } from "next";
import { AuthRouteGuard } from "@/components/website/auth-route-guard";
import { SiteLoader } from "@/components/website/site-loader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evently",
  description: "A refined event planning experience for memorable occasions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">
        <SiteLoader />
        <AuthRouteGuard />
        {children}
      </body>
    </html>
  );
}
