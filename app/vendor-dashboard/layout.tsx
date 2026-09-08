import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Search } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { HeaderActions } from "./header-actions";

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
    <section
      className={`${playfairDisplay.variable} min-h-screen bg-[#f3f4f6] font-inter text-[#16231f]`}
    >
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] overflow-y-auto bg-[#001B12] px-5 pb-6 pt-28 text-white shadow-2xl shadow-black/15 lg:block">
        <SidebarNav />
      </aside>

      <div className="min-h-screen bg-[#f3f4f6] lg:pl-[280px]">
        <header className="sticky top-0 z-50 bg-[#001B12] px-5 py-4 text-white shadow-lg shadow-black/10 lg:-ml-[280px] lg:px-8">
          <div className="flex items-center gap-4">
            <div>
             
              <h1 className="[font-family:var(--font-playfair)] text-[40px] uppercase  font-normal leading-tight">
                Vendor Dashboard
              </h1>
            </div>

            <div className="ml-auto hidden min-h-11 w-full max-w-[560px] items-center gap-3 rounded-[10px] border border-white/40 px-4 text-[#fff] shadow-sm md:flex">
              <Search className="h-5 w-5 text-[#fff]" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search dashboard"
                className="w-full bg-transparent font-inter  text-sm outline-none placeholder:text-[#fff]"
              />
            </div>

            {/* <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-[#0D5B46] shadow-sm transition-colors hover:bg-[#f2c15f]"
              aria-label="Messages"
            >
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </button> */}

            <HeaderActions />
          </div>
        </header>

        <main className="min-h-[calc(100vh-80px)] bg-[#f3f4f6] px-5 py-7 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </section>
  );
}
