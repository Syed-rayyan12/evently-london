"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getVendorProfileSession,
  hasApprovedVendorSession,
  hasCompletedVendorProfileSession,
} from "@/lib/vendor-session";

export function AuthRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  const enforceVendorRoute = useCallback(() => {
    const session = getVendorProfileSession();

    if (session?.role !== "VENDOR" || !session.id || !session.token) {
      return;
    }

    const isVendorRoute = pathname === "/vendor-dashboard" || pathname.startsWith("/vendor-dashboard/");
    const isSetupRoute = pathname === "/vendor-dashboard/setup";
    const isPendingRoute = pathname === "/vendor-dashboard/pending-approval";
    const profileComplete = hasCompletedVendorProfileSession(session);
    const vendorApproved = hasApprovedVendorSession(session);

    if (!profileComplete && !isSetupRoute) {
      router.replace("/vendor-dashboard/setup");
      return;
    }

    if (profileComplete && !vendorApproved && !isPendingRoute) {
      router.replace("/vendor-dashboard/pending-approval");
      return;
    }

    if (profileComplete && vendorApproved && (!isVendorRoute || isSetupRoute || isPendingRoute)) {
      router.replace("/vendor-dashboard");
    }
  }, [pathname, router]);

  useEffect(() => {
    enforceVendorRoute();
  }, [enforceVendorRoute]);

  useEffect(() => {
    window.addEventListener("pageshow", enforceVendorRoute);
    window.addEventListener("popstate", enforceVendorRoute);
    window.addEventListener("focus", enforceVendorRoute);
    window.addEventListener("evently.vendor.updated", enforceVendorRoute);

    return () => {
      window.removeEventListener("pageshow", enforceVendorRoute);
      window.removeEventListener("popstate", enforceVendorRoute);
      window.removeEventListener("focus", enforceVendorRoute);
      window.removeEventListener("evently.vendor.updated", enforceVendorRoute);
    };
  }, [enforceVendorRoute]);

  return null;
}
