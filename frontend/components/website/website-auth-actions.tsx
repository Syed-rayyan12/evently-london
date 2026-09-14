"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import type { SignupRole } from "@/lib/auth";
import { clearAdminSession, getAdminSession } from "@/lib/admin-session";
import { clearCustomerProfileSession, getCustomerProfileSession } from "@/lib/customer-session";
import {
  clearVendorProfileSession,
  getVendorProfileSession,
  hasApprovedVendorSession,
  hasCompletedVendorProfileSession,
} from "@/lib/vendor-session";
import { AccountLoginModal } from "./account-login-modal";
import { SignupModal } from "./signup-modal";

type WebsiteAuthActionsProps = {
  loginClassName: string;
  signupClassName: string;
};

type ActiveSession = {
  label: string;
  href: string;
  clear: () => void;
};

function getActiveSession(): ActiveSession | null {
  const admin = getAdminSession();

  if (admin?.role === "ADMIN" && admin.token) {
    return {
      label: "Admin Dashboard",
      href: "/admin-dashboard/approvals",
      clear: clearAdminSession
    };
  }

  const customer = getCustomerProfileSession();

  if (customer?.role === "CUSTOMER" && customer.id && customer.token) {
    return {
      label: "Customer Dashboard",
      href: "/customer-dashboard",
      clear: clearCustomerProfileSession
    };
  }

  const vendor = getVendorProfileSession();

  if (vendor?.role === "VENDOR" && vendor.id && vendor.token) {
    const hasCompletedProfile = hasCompletedVendorProfileSession(vendor);

    return {
      label: "Vendor Dashboard",
      href: !hasCompletedProfile
        ? "/vendor-dashboard/setup"
        : hasApprovedVendorSession(vendor)
          ? "/vendor-dashboard"
          : "/vendor-dashboard/pending-approval",
      clear: clearVendorProfileSession
    };
  }

  return null;
}

export function WebsiteAuthActions({
  loginClassName,
  signupClassName
}: WebsiteAuthActionsProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<SignupRole>("CUSTOMER");
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

  useEffect(() => {
    function syncSession() {
      setActiveSession(getActiveSession());
      setLoginOpen(false);
    }

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("pageshow", syncSession);
    window.addEventListener("focus", syncSession);
    window.addEventListener("evently.admin.updated", syncSession);
    window.addEventListener("evently.customer.updated", syncSession);
    window.addEventListener("evently.vendor.updated", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("pageshow", syncSession);
      window.removeEventListener("focus", syncSession);
      window.removeEventListener("evently.admin.updated", syncSession);
      window.removeEventListener("evently.customer.updated", syncSession);
      window.removeEventListener("evently.vendor.updated", syncSession);
    };
  }, []);

  function openLogin(role: SignupRole) {
    setLoginRole(role);
    setLoginOpen(true);
  }

  if (activeSession) {
    return (
      <div className="flex items-center gap-2 justify-self-end">
        <Link
          href={activeSession.href}
          className={loginClassName}
        >
          <span className="btn-slide-overlay btn-slide-overlay-gold" />
          <span className="btn-slide-label transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink">
            Dashboard
          </span>
        </Link>
        <button
          type="button"
          aria-label={`Logout from ${activeSession.label}`}
          onClick={() => {
            activeSession.clear();
            setActiveSession(null);
          }}
          className="grid h-11 w-11 place-items-center rounded-[10px] border border-brand-gold text-white transition hover:bg-brand-gold hover:text-ink"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-self-end">
      <AccountLoginModal
        buttonClassName={loginClassName}
        open={loginOpen}
        initialRole={loginRole}
        onOpenChange={setLoginOpen}
      />
      <SignupModal buttonClassName={signupClassName} onLoginRequest={openLogin} />
    </div>
  );
}
