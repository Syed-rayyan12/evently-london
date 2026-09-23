"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { MobileDashboardNav } from "@/components/dashboard/mobile-dashboard-nav";
import { getVendorProfile } from "@/lib/auth";
import {
  clearVendorProfileSession,
  getVendorProfileSession,
  saveVendorProfileSession,
} from "@/lib/vendor-session";
import { SidebarNav, vendorSidebarLinks } from "./sidebar-nav";
import { HeaderActions } from "./header-actions";

export function VendorDashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    const session = getVendorProfileSession();
    const isSetupPage = pathname === "/vendor-dashboard/setup";
    const isPendingPage = pathname === "/vendor-dashboard/pending-approval";

    if (session?.role !== "VENDOR" || !session.id || !session.token) {
      router.replace("/");
      return;
    }

    getVendorProfile(session)
      .then((result) => {
        if (!active) {
          return;
        }

        saveVendorProfileSession(result.user, session.token, result.profile);

        if (!result.profile && !isSetupPage) {
          router.replace("/vendor-dashboard/setup");
          return;
        }

        if (result.profile && result.user.approvalStatus !== "APPROVED") {
          if (!isPendingPage) {
            router.replace("/vendor-dashboard/pending-approval");
            return;
          }

          setAuthorized(true);
          return;
        }

        if (result.profile && (isSetupPage || isPendingPage)) {
          router.replace("/vendor-dashboard");
          return;
        }

        setAuthorized(true);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        clearVendorProfileSession();
        router.replace("/");
      });

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (!authorized) {
    return (
      <section className="grid min-h-screen place-items-center bg-[#f3f4f6] font-inter text-sm font-semibold text-[#0D5B46]">
        Checking vendor session...
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f3f4f6] font-inter text-[#16231f]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] overflow-y-auto bg-[#001B12] px-5 pb-6 pt-28 text-white shadow-2xl shadow-black/15 lg:block">
        <SidebarNav />
      </aside>

      <div className="min-h-screen bg-[#f3f4f6] lg:pl-[280px]">
        <header className="sticky top-0 z-50 bg-[#001B12] px-4 py-3 text-white shadow-lg shadow-black/10 sm:px-5 sm:py-4 lg:-ml-[280px] lg:px-8">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1 md:flex-none">
              <h1 className="truncate [font-family:var(--font-playfair)] text-[23px] font-normal uppercase leading-tight sm:text-[30px] lg:text-[34px]">
                Vendor Dashboard
              </h1>
            </div>

            <div className="ml-auto hidden min-h-11 w-full max-w-[560px] items-center gap-3 rounded-[10px] border border-white/40 px-4 text-[#fff] shadow-sm md:flex">
              <Search className="h-5 w-5 text-[#fff]" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search dashboard"
                className="w-full bg-transparent font-inter text-sm outline-none placeholder:text-[#fff]"
              />
            </div>

            <HeaderActions />
          </div>
        </header>

        <main className="min-h-[calc(100vh-80px)] bg-[#f3f4f6] px-4 pb-28 pt-5 sm:px-5 sm:py-7 lg:px-8 lg:py-8">
          {children}
        </main>
        <MobileDashboardNav
          links={vendorSidebarLinks}
          baseHref="/vendor-dashboard"
          label="Vendor mobile navigation"
        />
      </div>
    </section>
  );
}
