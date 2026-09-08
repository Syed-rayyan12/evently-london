import type { Metadata } from "next";
import { Inter, PT_Serif } from "next/font/google";
import { SiteLoader } from "@/components/website/site-loader";
import "./globals.css";

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
      className={`${inter.variable} ${ptSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
