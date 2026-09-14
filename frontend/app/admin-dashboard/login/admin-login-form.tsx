"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth";
import { getAdminSession, saveAdminSession } from "@/lib/admin-session";
import { getCustomerProfileSession } from "@/lib/customer-session";
import { getVendorProfileSession } from "@/lib/vendor-session";

function getAuthenticatedRedirectPath() {
  const admin = getAdminSession();

  if (admin?.role === "ADMIN" && admin.token) {
    return "/admin-dashboard/approvals";
  }

  const customer = getCustomerProfileSession();

  if (customer?.role === "CUSTOMER" && customer.id && customer.token) {
    return "/customer-dashboard";
  }

  const vendor = getVendorProfileSession();

  if (vendor?.role === "VENDOR" && vendor.id && vendor.token) {
    return "/vendor-dashboard";
  }

  return null;
}

export function AdminLoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    function redirectIfAuthenticated() {
      const redirectPath = getAuthenticatedRedirectPath();

      if (redirectPath) {
        router.replace(redirectPath);
      }
    }

    redirectIfAuthenticated();
    window.addEventListener("pageshow", redirectIfAuthenticated);
    window.addEventListener("focus", redirectIfAuthenticated);
    window.addEventListener("evently.admin.updated", redirectIfAuthenticated);
    window.addEventListener("evently.customer.updated", redirectIfAuthenticated);
    window.addEventListener("evently.vendor.updated", redirectIfAuthenticated);

    return () => {
      window.removeEventListener("pageshow", redirectIfAuthenticated);
      window.removeEventListener("focus", redirectIfAuthenticated);
      window.removeEventListener("evently.admin.updated", redirectIfAuthenticated);
      window.removeEventListener("evently.customer.updated", redirectIfAuthenticated);
      window.removeEventListener("evently.vendor.updated", redirectIfAuthenticated);
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await loginAdmin({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      });

      if (!result.admin.token) {
        throw new Error("Admin login succeeded but the API did not return a session token.");
      }

      saveAdminSession(result.admin);
      setStatus("success");
      setMessage("Admin login successful.");
      router.replace("/admin-dashboard/approvals");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Admin login failed");
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <section className="rounded-[16px] border border-[#C07C22]/45 bg-[#001B12] p-6 shadow-lg shadow-[#001B12]/25">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/site-logo.png"
            alt="Evently"
            width={152}
            height={104}
            priority
            className="h-24 w-auto object-contain"
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-white">Admin email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-2 h-11 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-[#16231f] outline-none transition focus:border-[#C07C22]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-white">Admin password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 h-11 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-[#16231f] outline-none transition focus:border-[#C07C22]"
            />
          </label>

          {message ? (
            <p
              className={`rounded-md px-3 py-2 text-sm ${
                status === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
              aria-live="polite"
            >
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className="h-11 w-full rounded-md bg-[#C07C22] px-4 text-sm font-semibold text-white transition hover:bg-[#003224] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Signing in..." : "Login as admin"}
          </button>
        </form>
      </section>
    </div>
  );
}
