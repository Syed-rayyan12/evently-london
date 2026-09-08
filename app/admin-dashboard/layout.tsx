import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Search } from "lucide-react";
import { AdminHeaderActions } from "./header-actions";
import { AdminSidebarNav } from "./sidebar-nav";

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
    <section
      className={`${playfairDisplay.variable} min-h-screen bg-[#f3f4f6] font-inter text-[#16231f]`}
    >
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] overflow-y-auto bg-[#001B12] px-5 pb-6 pt-28 text-white shadow-2xl shadow-black/15 lg:block">
        <AdminSidebarNav />
      </aside>

      <div className="min-h-screen bg-[#f3f4f6] lg:pl-[280px]">
        <header className="sticky top-0 z-50 bg-[#001B12] px-5 py-4 text-white shadow-lg shadow-black/10 lg:-ml-[280px] lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="[font-family:var(--font-playfair)] text-[40px] font-normal uppercase leading-tight">
              Admin Dashboard
            </h1>

            <div className="ml-auto hidden min-h-11 w-full max-w-[560px] items-center gap-3 rounded-[10px] border border-white/40 px-4 text-white shadow-sm md:flex">
              <Search className="h-5 w-5 text-white/80" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search dashboard"
                className="w-full bg-transparent font-inter text-sm text-white outline-none placeholder:text-white/60"
              />
            </div>

            <AdminHeaderActions />
          </div>
        </header>

        <main className="min-h-[calc(100vh-80px)] bg-[#f3f4f6] px-5 py-7 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </section>
  );
}
