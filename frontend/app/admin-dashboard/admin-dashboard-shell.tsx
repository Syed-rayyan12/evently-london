"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { MobileDashboardNav } from "@/components/dashboard/mobile-dashboard-nav";
import { getAdminSession } from "@/lib/admin-session";
import { AdminHeaderActions } from "./header-actions";
import { AdminSidebarNav, adminSidebarLinks } from "./sidebar-nav";

export function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin-dashboard/login";
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      void Promise.resolve().then(() => setAuthorized(true));
      return;
    }

    const session = getAdminSession();

    if (session?.role !== "ADMIN" || !session.token) {
      router.replace("/login");
      return;
    }

    void Promise.resolve().then(() => setAuthorized(true));
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return (
      <section className="min-h-screen bg-[#f3f4f6] px-5 py-10 font-inter text-[#16231f]">
        <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-lg items-center">
          {children}
        </main>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="grid min-h-screen place-items-center bg-[#f3f4f6] font-inter text-sm font-semibold text-[#0D5B46]">
        Checking admin session...
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f3f4f6] font-inter text-[#16231f]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] overflow-y-auto bg-[#001B12] px-5 pb-6 pt-28 text-white shadow-2xl shadow-black/15 lg:block">
        <AdminSidebarNav />
      </aside>

      <div className="min-h-screen bg-[#f3f4f6] lg:pl-[280px]">
        <header className="sticky top-0 z-50 bg-[#001B12] px-4 py-3 text-white shadow-lg shadow-black/10 sm:px-5 sm:py-4 lg:-ml-[280px] lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="[font-family:var(--font-playfair)] text-[24px] font-normal uppercase leading-tight sm:text-[30px] lg:text-[40px]">
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

        <main className="min-h-[calc(100vh-80px)] bg-[#f3f4f6] px-4 pb-7 pt-5 max-[520px]:pb-28 sm:px-5 sm:py-7 lg:px-8 lg:py-8">
          {children}
        </main>
        <MobileDashboardNav
          links={adminSidebarLinks}
          baseHref="/admin-dashboard"
          label="Admin mobile navigation"
        />
      </div>
    </section>
  );
}
