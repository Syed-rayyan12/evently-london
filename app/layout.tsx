import type { Metadata } from "next";
import { Inter, PT_Serif, Geist } from "next/font/google";
import { AuthRouteGuard } from "@/components/website/auth-route-guard";
import { SiteLoader } from "@/components/website/site-loader";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Evently",
  description: "A refined event planning experience for memorable occasions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, ptSerif.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <SiteLoader />
        <AuthRouteGuard />
        {children}
      </body>
    </html>
  );
}
